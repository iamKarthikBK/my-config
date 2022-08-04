package AES;
import AES_modes::*;
`include "Logger.bsv"       // for logging display statements.
import axi4::*;
import axi4l::*;
import apb::*;
import Semi_FIFOF::*;
import DCBus::*;
import Reserved :: *;
import Vector::*;
import FIFOF::*;
import SpecialFIFOs::*;
import Counter::*;
import ConfigReg::*;

export Aes_key_type (..);
export AES_modes::*;
export Ifc_AES (..);
export Ifc_aes_axi4l (..);
export mkaes_axi4l;
export Ifc_aes_axi4  (..);
export mkaes_axi4;
export Ifc_aes_apb   (..);
export mkaes_apb;

interface Ifc_AES#(numeric type n_sbox);
  method Bool can_take_inp;
  method Bool outp_ready;
endinterface

typedef IWithSlave#(Ifc_axi4_slave#(iw, aw, dw, uw), Ifc_AES#(n_sbox))
    Ifc_aes_axi4#(type iw, type aw, type dw, type uw, numeric type n_sbox);
typedef IWithSlave#(Ifc_axi4l_slave#(aw, dw, uw), Ifc_AES#(n_sbox))
    Ifc_aes_axi4l#(type aw, type dw, type uw, numeric type n_sbox);
typedef IWithSlave#(Ifc_apb_slave#(aw, dw, uw), Ifc_AES#(n_sbox))
    Ifc_aes_apb#(type aw, type dw, type uw, numeric type n_sbox);

typedef struct {
  ReservedZero#(30) zeros1;
  Bool outp_ready;
  Bool can_take_inp;
} AES_status deriving (Bits, Eq, FShow);

typedef struct {
  ReservedZero#(20) zeros2;                   //Bits 31:12
  Bit#(2) out_access_size;                    //Bits 11:10
  Bit#(2) inp_access_size;                    //Bits 9:8
  ReservedZero#(1)  zeros1;                   //Bit  7
  Bit#(1) endian;   //0: Little, 1:Big        //Bit  6
  Mode mode;                                  //Bits 5:3
  Aes_key_type key_type;                      //Bits 2:1
  Bool decrypt;     //0: Encrypt, 1: Decrypt  //Bit  0
} AES_config deriving (Bits, Eq, FShow);

typedef struct {
  ReservedZero#(30) zeros1;                   //Bits 31:2
  Bool start_new_block;                       //Bit 1
  Bool genKeys;                               //Bit 0
} AES_commence deriving(Bits, Eq, FShow);    

// ------------------------------ Regular Read-write register ------------------------------------
module configRegRW#(DCRAddr#(aw,o) attr, r reset)(IWithDCBus#(DCBus#(aw, dw), Reg#(r)))
  provisos (
    Add#(TSub#(2, TLog#(TDiv#(dw, 8))), d__, o),
    Bits#(r, m),
    Add#(a__, o, aw),
    Mul#(TDiv#(dw, 8), 8, dw), // bus-side data-width should be multiples of 8
    Mul#(TDiv#(m, 8), 8, m), // register data-width should be multiples of 8
    Add#(dw, b__, 64), // bus side data should be <= 64
    Add#(m, c__, 64),  // register data should be <= 64
    Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
    Add#(TExp#(TLog#(m)),0,m), // register side should be a power of 2
    Add#(e__, TDiv#(dw, 8), 8)
  );

  Reg#(r) x();
  mkConfigReg#(reset) inner_reg(x);
  PulseWire written <- mkPulseWire;

  interface DCBus dcbus;
    method ActionValue#(Bool) write(Bit#(aw) addr, Bit#(dw) data, Bit#(TDiv#(dw,8)) strobe, DCBusXperm wperm);
      Bit#(TSub#(aw,o)) req_index = truncateLSB(addr);
      Bit#(TSub#(aw,o)) reg_index = truncateLSB(attr.addr);
      Bool perm = ((attr.wr_perm == PvU) || (wperm >= attr.wr_perm));
      if ((req_index == reg_index) && perm) begin
        let {succ, temp} <- fn_adjust_write(addr, data, strobe, pack(x), attr.min, attr.max, attr.mask);
        if(succ) begin x<= unpack(temp); written.send; end // give cbus write priority over device _write.
        return succ;
      end
      else
        return False;
    endmethod:write

    method ActionValue#(Tuple2#(Bool,Bit#(dw))) read(Bit#(aw) addr, AccessSize size, DCBusXperm rperm);
      Bit#(TSub#(aw,o)) req_index = truncateLSB(addr);
      Bit#(TSub#(aw,o)) reg_index = truncateLSB(attr.addr);
      Bool perm = ((attr.rd_perm == PvU) || (rperm >= attr.rd_perm));
      if ((req_index == reg_index) && perm) begin
        let temp = fn_adjust_read(addr, size, pack(x), attr.min, attr.max, attr.mask );
        return temp;
      end
      else
        return tuple2(False, 0);
    endmethod:read
  endinterface:dcbus
  interface Reg device;
    method Action _write (value);
      if (!written) x <= value;
    endmethod:_write
    method _read = x._read;
  endinterface
endmodule:configRegRW

// A wrapper to provide just a normal Reg interface and automatically
// add the CBus interface to the collection. This is the module used
// in designs (as a normal register would be used).
module [ModWithDCBus#(aw, dw)] mkDCBConfigRegRW#(DCRAddr#(aw,o) attr, r x)(Reg#(r))
  provisos (
    Add#(TSub#(2, TLog#(TDiv#(dw, 8))), d__, o),
    Bits#(r, m),
    Add#(a__, o, aw),
    Mul#(TDiv#(dw, 8), 8, dw), // bus-side data-width should be multiples of 8
    Mul#(TDiv#(m, 8), 8, m), // register data-width should be multiples of 8
    Add#(dw, b__, 64), // bus side data should be <= 64
    Add#(m, c__, 64),  // register data should be <= 64
    Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
    Add#(TExp#(TLog#(m)),0,m), // register side should be a power of 2
    Add#(e__, TDiv#(dw, 8), 8)
  );
  let ifc();
  collectDCBusIFC#(configRegRW(attr, x)) _temp(ifc);
  return(ifc);
endmodule:mkDCBConfigRegRW
// ------------------------------------------------------------------------------------------------


module [ModWithDCBus#(aw,dw)] mkaes_config_regs#(Integer inp_depth, Integer out_depth) (Ifc_AES#(n_sbox)) provisos (
  Div#(128,dw,num_inp_regs),
  Div#(256,dw,num_key_regs),
  Mul#(TDiv#(dw,8),8,dw),
  Add#(a__,2,aw),
  Add#(b__, TDiv#(dw,8),8),
  Add#(dw, c__, 64),
  Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
  Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
  Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256)
);
  let v_dw= valueOf(dw);
  let v_dw_bytes= v_dw/8;
  let v_num_inp_regs= valueOf(num_inp_regs);
  let v_next_inp_addr= v_num_inp_regs*v_dw_bytes;
  Integer i;

  // Internal registers
  FIFOF#(Bit#(128)) ff_input  <- mkCustomSizedBypassFIFOF(inp_depth);
  FIFOF#(Bit#(128)) ff_output <- mkCustomSizedBypassFIFOF(out_depth);
  Reg#(Bit#(TLog#(TAdd#(num_inp_regs,1)))) rg_inp_counter <- mkReg(0);
  Reg#(Bit#(TLog#(num_inp_regs))) rg_outp_counter <- mkReg(0);
 
  // attr_input   0x00 to 0x0F  
  // attr_output  0x10 to 0x1F  
  // attr_iv      0x20 to 0x2F  
  // attr_key     0x30 to 0x4F  
  //Memory mapped Registers/Wires
  Vector#(num_inp_regs, DCRAddr#(aw, 2)) attr_input, attr_output, attr_iv;
  Bit#(aw) last_inp_addr;
  for(i=0; i<v_num_inp_regs; i=i+1) begin
    let i4= fromInteger(i)*fromInteger(v_dw_bytes);
    let inc= fromInteger(v_next_inp_addr);
    attr_input[i]  = DCRAddr {addr: i4, min: Sz1, max: Sz8, mask: 'b00, wr_perm: PvU, rd_perm: PvM};
    attr_output[i] = DCRAddr {addr: inc+i4, min: Sz1, max: Sz8, mask: 'b00, wr_perm: ?, rd_perm: PvU};
    attr_iv[i]     = DCRAddr {addr: (2*inc)+i4, min: Sz1, max: Sz8, mask: 'b00, wr_perm: PvU, rd_perm: PvM};
    last_inp_addr= (2*inc)+i4+fromInteger(v_dw_bytes);
  end

  Vector#(num_key_regs, DCRAddr#(aw, 2)) attr_key;
  Bit#(aw) last_key_addr;
  for(i=0; i<valueOf(num_key_regs); i=i+1) begin
    let i4= fromInteger(i)*fromInteger(v_dw_bytes);
    attr_key[i]  = DCRAddr {addr: last_inp_addr+i4, min: Sz1, max: Sz8, mask: 'b00, wr_perm: PvU, rd_perm: PvM};
    last_key_addr= last_inp_addr+i4+fromInteger(v_dw_bytes);
  end

  DCRAddr#(aw,2) attr_status =  DCRAddr {addr: last_key_addr, min: Sz1, max: Sz8, mask: 'b00, wr_perm: ?, rd_perm: PvU};
  DCRAddr#(aw,2) attr_config =  DCRAddr {addr: last_key_addr+8, min: Sz1, max: Sz8, mask: 'b00, wr_perm: PvU, rd_perm: PvM};
  DCRAddr#(aw,2) attr_commence= DCRAddr {addr: last_key_addr+16, min: Sz1, max: Sz8, mask: 'b00, wr_perm: PvU, rd_perm: ?};

  Vector#(num_inp_regs, Reg#(Bit#(dw))) rg_input, rg_output, rg_iv;
  Wire#(Bool) wr_new_inp <- mkDWire(False), wr_outp_read <- mkDWire(False);
  for(i=0; i<v_num_inp_regs; i=i+1) begin
    rg_input[i] <- mkDCBRegRWSe(attr_input[i], 0, wr_new_inp._write(True));
    rg_output[i] <- mkDCBRegROSe(attr_output[i], 0, wr_outp_read._write(True));
    rg_iv[i] <- mkDCBConfigRegRW(attr_iv[i], 0);
  end
  Vector#(num_key_regs, Reg#(Bit#(dw))) rg_key;
  for(i=0; i<valueOf(num_key_regs); i=i+1) begin
    rg_key[i] <- mkDCBConfigRegRW(attr_key[i], 0);
  end

  Reg#(AES_status) rg_status   <- mkDCBRegRO(attr_status, unpack(0));
  Reg#(AES_config) rg_config   <- mkDCBConfigRegRW(attr_config, unpack(0));
  RWire#(AES_commence)  wr_commence <- mkDCBRWireW(attr_commence);

  Ifc_AES_modes#(n_sbox) aes <- mkAES_modes(pack(readVReg(rg_key)), rg_config.decrypt, rg_config.key_type, rg_config.mode, pack(readVReg(rg_iv)));

  rule rl_update_status;
    rg_status<= AES_status {outp_ready: ff_output.notEmpty, can_take_inp: (ff_input.notFull && ff_output.notFull)};
  endrule

  rule rl_start_new_block(wr_commence.wget matches tagged Valid .v1);
    if(v1.start_new_block)
      aes.start_new_block;
    if(v1.genKeys)
      aes.genKeys;
  endrule

  Bool got_full_inp= rg_inp_counter==fromInteger(v_num_inp_regs);
  rule rl_set_counter;
    if(wr_new_inp && got_full_inp)
      rg_inp_counter<= 1;
    else if(wr_new_inp)
      rg_inp_counter<= rg_inp_counter+1;
    else if(got_full_inp)
      rg_inp_counter<= 0;      
  endrule

  rule rl_enq_to_ff(got_full_inp);
    ff_input.enq(pack(readVReg(rg_input)));
  endrule

  rule rl_send_inp_ff_to_aes;
    aes.operate(ff_input.first);
    ff_input.deq;
  endrule

  rule rl_get_outp_to_ff;
    let res <- aes.outp;
    ff_output.enq(res);
  endrule

  rule rl_ff_to_output_reg;
    let val= ff_output.first;
    for(Integer i=0; i<v_num_inp_regs; i=i+1)
      rg_output[i]<= val[(v_dw*(i+1))-1:i*v_dw];
    //writeVReg(rg_output,unpack(ff_output.first));
  endrule 

  rule rl_deq_ff_output(wr_outp_read);
    if(rg_outp_counter==fromInteger(v_num_inp_regs-1)) begin
      ff_output.deq;
      rg_outp_counter<= 0;
    end
    else
      rg_outp_counter<= rg_outp_counter + 1;
  endrule

  method Bool can_take_inp;
    return ff_input.notFull;
  endmethod

  method Bool outp_ready;
    return ff_output.notEmpty;
  endmethod

endmodule

module [Module] mkaes_block#(Integer inp_depth, Integer out_depth) (IWithDCBus#(DCBus#(aw,dw), Ifc_AES#(n_sbox))) provisos (
  Div#(128,dw,num_inp_regs),
  Div#(256,dw,num_key_regs),
  Mul#(TDiv#(dw,8),8,dw),
  Add#(a__,2,aw),
  Add#(b__, TDiv#(dw,8),8),
  Add#(dw, c__, 64),
  Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
  Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
  Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256)
);
  let ifc <- exposeDCBusIFC(mkaes_config_regs(inp_depth, out_depth));
  return ifc;
endmodule

module [Module] mkaes_axi4l#(parameter Integer inp_depth, parameter Integer out_depth,
parameter Integer base, Clock aes_clk, Reset aes_rst) (Ifc_aes_axi4l#(aw,dw,uw,n_sbox)) provisos (
  Div#(128,dw,num_inp_regs),
  Div#(256,dw,num_key_regs),
  Mul#(TDiv#(dw,8),8,dw),
  Add#(a__,2,aw),
  Add#(b__, TDiv#(dw,8),8),
  Add#(dw, c__, 64),
  Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
  Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
  Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256)
);
  let temp_aes_mod = mkaes_block(clocked_by aes_clk, reset_by aes_rst, inp_depth, out_depth);
  Ifc_aes_axi4l#(aw, dw, uw, n_sbox) aes_mod <- dc2axi4l(temp_aes_mod, base, aes_clk, aes_rst);
  return aes_mod;
endmodule

module [Module] mkaes_axi4#(parameter Integer inp_depth, parameter Integer out_depth,
parameter Integer base, Clock aes_clk, Reset aes_rst) (Ifc_aes_axi4#(iw,aw,dw,uw,n_sbox)) provisos (
  Div#(128,dw,num_inp_regs),
  Div#(256,dw,num_key_regs),
  Mul#(TDiv#(dw,8),8,dw),
  Add#(a__,2,aw),
  Add#(b__, TDiv#(dw,8),8),
  Add#(dw, c__, 64),
  Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
  Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
  Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256)
);
  let temp_aes_mod = mkaes_block(clocked_by aes_clk, reset_by aes_rst, inp_depth, out_depth);
  Ifc_aes_axi4#(iw, aw, dw, uw, n_sbox) aes_mod <- dc2axi4(temp_aes_mod, base, aes_clk, aes_rst);
  return aes_mod;
endmodule

module [Module] mkaes_apb#(parameter Integer inp_depth, parameter Integer out_depth,
parameter Integer base, Clock aes_clk, Reset aes_rst) (Ifc_aes_apb#(aw,dw,uw,n_sbox)) provisos (
  Div#(128,dw,num_inp_regs),
  Div#(256,dw,num_key_regs),
  Mul#(TDiv#(dw,8),8,dw),
  Add#(a__,2,aw),
  Add#(b__, TDiv#(dw,8),8),
  Add#(dw, c__, 64),
  Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
  Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
  Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256)
);
  let temp_aes_mod = mkaes_block(clocked_by aes_clk, reset_by aes_rst, inp_depth, out_depth);
  Ifc_aes_apb#(aw, dw, uw, n_sbox) aes_mod <- dc2apb(temp_aes_mod, base, aes_clk, aes_rst);
  return aes_mod;
endmodule

/*(*synthesize*)
module mkinst_aes_axi4l(Ifc_aes_axi4l#(32, 32, 0, 16));
  let curr_clk <- exposeCurrentClock;
  let curr_reset <- exposeCurrentReset;
  let ifc();
  mkaes_axi4l#(4, 4, 'h12300, curr_clk, curr_reset) _temp(ifc);
  return ifc;
endmodule*/

endpackage
