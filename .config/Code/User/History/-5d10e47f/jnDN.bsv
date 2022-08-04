package ECC;

    import axi4       :: * ; 
    import axi4l      :: * ;
    import apb        :: * ;
    import DCBus      :: * ;
    import pubkey_gen :: * ;
    import Reserved   :: * ;
    import Vector     :: * ;
    import ConfigReg  :: * ;

    `include "accel.defines"

    interface Ifc_ECC;
        method Bool mv_idle;
        method Bool mv_outp_ready;
    endinterface: Ifc_ECC

    typedef IWithSlave#(Ifc_axi4_slave#(iw, aw, dw, uw), Ifc_ECC) Ifc_ecc_axi4#(type iw, type aw, type dw, type uw);
    typedef IWithSlave#(Ifc_axi4l_slave#(aw, dw, uw), Ifc_ECC) Ifc_ecc_axi4l#(type aw, type dw, type uw);
    typedef IWithSlave#(Ifc_apb_slave#(aw, dw, uw), Ifc_ECC) Ifc_ecc_apb#(type aw, type dw, type uw);

    typedef struct {
        ReservedZero#(30) rzeroes;
        Bool idle;
        Bool outp_ready;
    } ECC_status deriving (Bits, Eq, FShow);

    typedef struct {
        ReservedZero#(23) rzeroes;
        Bit#(`KeySize) key;
    } KeyReg deriving (Bits, Eq, FShow);

    module [ModWithDCBus#(aw, dw)] mkecc_config_regs#(Integer key_size)(Ifc_ECC) provisos (
        Div#(256, dw, n_inp_regs),
        Div#(512, dw, n_outp_regs),
        Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 233),
        Bits#(Vector::Vector#(num_outp_regs, Bit#(dw)), 456),
        Add#(TExp#(TLog#(dw)),0,dw)
    );

        let lv_n_inp_regs = valueOf(n_inp_regs);
        let lv_n_outp_regs = valueOf(n_outp_regs);

        let lv_next_input_addr = lv_n_inp_regs * 4;

        // input
        // counter for these input regs
        Reg#(Bit#(TLog#(n_inp_regs))) rg_inp_counter <- mkReg(0);

        // memory mapped regs
        Vector#(n_inp_regs, DCRAddr#(aw, 2)) attr_input;

        // data reg
        Vector#(n_inp_regs, Reg#(Bit#(dw))) v_rg_input;

        // output
        // counter for these output regs
        Reg#(Bit#(TLog#(n_outp_regs))) rg_outp_counter <- mkReg(0);

        // memory mapped regs
        Vector#(TMul#(2, TDiv#(256, dw)), DCRAddr#(aw, 2)) attr_output;

        // data reg
        Vector#(n_outp_regs, Reg#(Bit#(dw))) v_rg_output;

        // internal
        Bit#(aw) lv_last_inp_addr;

        // status wires
        Wire#(Bool) wr_new_inp <- mkDWire(False), wr_outp_read <- mkDWire(False);

        for (Integer i = 0; i < lv_n_inp_regs ; i = i + 1 ) begin
            let i4= fromInteger(i)*4;
            let inc= fromInteger(lv_next_input_addr);
            attr_input[i]  = DCRAddr {addr: i4, min: Sz1, max: Sz4, mask: 2'b00, wr_perm: PvU, rd_perm: PvM};
            attr_output[i] = DCRAddr {addr: inc+i4, min: Sz1, max: Sz4, mask: 2'b00, wr_perm: ?, rd_perm: PvU};
            lv_last_inp_addr= (2*inc)+i4+4;
        end

        DCRAddr#(aw,2) attr_status =  DCRAddr {addr: lv_last_inp_addr, min: Sz1, max: Sz4, mask: 2'b01, wr_perm: ?, rd_perm: PvU};

        for (Integer i = 0 ; i < lv_n_inp_regs ; i = i + 1) begin
            v_rg_input[i] <- mkDCBRegRWSe(attr_input[i], 0, wr_new_inp._write(True));
        end

        for (Integer i = 0 ; i < lv_n_outp_regs ; i = i + 1) begin
            v_rg_output[i] <- mkDCBRegROSe(attr_output[i], 0, wr_outp_read._write(True));
        end

        Reg#(ECC_status) rg_status <- mkDCBRegRO(attr_status, unpack(0));
        Ifc_pubkey_gen pkgen <- mk_pubkey_gen(pack(readVReg(v_rg_input)));

        rule rl_update_status;
            let lv_idle = pkgen.mv_done();
            rg_status <= ECC_status{idle: lv_idle};
        endrule: rl_update_status

        Bool lv_got_full_inp = rg_inp_counter==fromInteger(lv_n_inp_regs);

        rule rl_set_counter;
            if(wr_new_inp && lv_got_full_inp)
                rg_inp_counter<= 1;
            else if(wr_new_inp)
                rg_inp_counter<= rg_inp_counter+1;
            else if(lv_got_full_inp)
                rg_inp_counter<= 0;      
        endrule

        rule rl_invoke_accel if (lv_got_full_inp == True);
            pkgen.ma_request_ops(); 
        endrule: rl_invoke_accel

        rule rl_send_output if (rg_status.idle == True && wr_outp_read == True);
            let ans = pkgen.mv_pubkey();
            writeVReg(v_rg_output, pack(zeroExtend({tpl_1(ans), tpl_2(ans)})));
        endrule: rl_send_output

        method Bool mv_idle;
            return rg_status.idle;
        endmethod: mv_idle

        method Bool mv_outp_ready;
            return rg_status.idle && (rg_inp_counter != 0);
        endmethod: mv_outp_ready

    endmodule: mkecc_config_regs

    module [Module] mk_ecc#(parameter Integer keysize) (IWithDCBus#(DCBus#(aw,dw), Ifc_ECC)) provisos (
        Mul#(a__, dw, 256)
    );
        let ifc <- exposeDCBusIFC(mkecc_config_regs(keysize));
        return ifc;
    endmodule

    module [Module] mkecc_axi4l#(parameter Integer keysize,
    parameter Integer base, Clock ecc_clk, Reset ecc_rst) (Ifc_ecc_axi4l#(aw,dw,uw)) provisos (
        Mul#(a__, dw, 256)
    );
        let temp_ecc_mod = mk_ecc(clocked_by ecc_clk, reset_by ecc_rst, keysize);
        Ifc_ecc_axi4l#(aw, dw, uw) ecc_mod <- dc2axi4l(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule

    module [Module] mkecc_axi4#(parameter Integer keysize,
    parameter Integer base, Clock ecc_clk, Reset ecc_rst) (Ifc_ecc_axi4#(iw,aw,dw,uw)) provisos (
        Mul#(a__, dw, 256)
    );
        let temp_ecc_mod = mk_ecc(clocked_by ecc_clk, reset_by ecc_rst, keysize);
        Ifc_ecc_axi4#(iw, aw, dw, uw) ecc_mod <- dc2axi4(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule

    module [Module] mkecc_apb#(parameter Integer keysize,
        parameter Integer base, Clock ecc_clk, Reset ecc_rst) (Ifc_ecc_apb#(aw,dw,uw)) provisos (
            Mul#(a__, dw, 256)
        );
        let temp_ecc_mod = mk_ecc(clocked_by ecc_clk, reset_by ecc_rst, keysize);
        Ifc_ecc_apb#(aw, dw, uw) ecc_mod <- dc2apb(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule

endpackage: ECC