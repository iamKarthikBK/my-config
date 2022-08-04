package ECC;

    import axi4       :: * ; 
    import axi4l      :: * ;
    import apb        :: * ;
    import DCBus      :: * ;
    import pubkey_gen :: * ;

    interface Ifc_ECC;
        method Bool mv_can_take_inp;
        method Bool mv_outp_ready;
    endinterface: Ifc_ECC

    function numeric type fn_rnd_reg_sz (lv_keysize);
        return  ((lv_key_size > 608) ? 640 :
                ((lv_key_size > 576) ? 608 :
                ((lv_key_size > 544) ? 576 :
                ((lv_key_size > 512) ? 544 :
                ((lv_key_size > 480) ? 512 :
                ((lv_key_size > 448) ? 480 :
                ((lv_key_size > 416) ? 448 :
                ((lv_key_size > 384) ? 416 :
                ((lv_key_size > 352) ? 384 :
                ((lv_key_size > 320) ? 352 :
                ((lv_key_size > 288) ? 320 :
                ((lv_key_size > 256) ? 288 :
                ((lv_key_size > 224) ? 256 :
                ((lv_key_size > 192) ? 224 :
                ((lv_key_size > 160) ? 192 :
                ((lv_key_size > 128) ? 160 :
                ((lv_key_size > 96) ? 128 :
                ((lv_key_size > 64) ? 96 :
                ((lv_key_size > 32) ? 64 :
                ((lv_key_size > 0) ? 32 : 0))))))))))))))))))));
    endfunction: fn_rnd_reg_sz

    typedef IWithSlave#(Ifc_axi4_slave#(iw, aw, dw, uw), Ifc_AES#(n_sbox))
        Ifc_ecc_axi4#(type iw, type aw, type dw, type uw, numeric type n_sbox);
    typedef IWithSlave#(Ifc_axi4l_slave#(aw, dw, uw), Ifc_AES#(n_sbox))
        Ifc_ecc_axi4l#(type aw, type dw, type uw, numeric type n_sbox);
    typedef IWithSlave#(Ifc_apb_slave#(aw, dw, uw), Ifc_AES#(n_sbox))
        Ifc_ecc_apb#(type aw, type dw, type uw, numeric type n_sbox);

    typedef struct {
        ReservedZero#(30) rzeroes;
        Bool outp_ready;
        Bool can_take_inp;
    } ECC_status deriving (Bits, Eq, FShow);

    typedef struct {
        ReservedZero#(fn_rnd_reg_sz() - `KeySize) rzeroes;
        Bit#(`KeySize) key;
    } KeyReg deriving (Bits, Eq, FShow);

    typedef struct {
        ReservedZero#(fn_rnd_reg_sz() - `KeySize) rzeroes;
        Bit#(`KeySize) key;
    } ECC_PrivKeyReg deriving (Bits, Eq, FShow);

    module configRegRW#(DCRAddr#(aw,o) attr, r reset)(IWithDCBus#(DCBus#(aw, dw), Reg#(r))) provisos (
        Add#(TSub#(2, TLog#(TDiv#(dw, 8))), d__, o),
        Bits#(r, m),
        Add#(a__, o, aw),
        Mul#(TDiv#(dw, 8), 8, dw), // bus-side data-width should be multiples of 8
        Mul#(TDiv#(m, 8), 8, m), // register data-width should be multiples of 8
        Add#(dw, b__, 64), // bus side data should be <= 64
        Add#(m, c__, 64),  // register data should be <= 64
        Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
        Add#(TExp#(TLog#(m)),0,m), // register side should be a power of 2
        Add#(e__, TDiv#(dw, 8), 8));

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
        Add#(e__, TDiv#(dw, 8), 8));
        let ifc();
        collectDCBusIFC#(configRegRW(attr, x)) _temp(ifc);
        return(ifc);
    endmodule:mkDCBConfigRegRW

    module [ModWithDCBus#(aw, dw)] mk_ECC_config_regs#(Integer key_size)(Ifc_ECC);

        let lv_rnd_sz = fn_rnd_reg_sz(key_size);
        let lv_n_inp_regs = valueOf(TDiv#(lv_rnd_sz, dw));

        // input
        // address-width regs to hold private key
        Vector#(lv_n_inp_regs, Reg#(Bit#(aw))) v_rg_priv_key;

        // counter for these input regs
        Reg#(Bit#(TLog#(lv_n_inp_regs))) rg_inp_cnt <- mkReg(0);

        // memory mapped regs
        Vector#(TDiv#(lv_rnd_sz, dw), DCRAddr#(aw, 2)) attr_input;

        // output
        // address-width regs to hold public key
        Vector#(TMul#(2, TDiv#(lv_rnd_sz, dw)), Reg#(Bit#(aw))) v_rg_pub_key;

        // counter for these output regs
        Reg#(Bit#(TLog#(TMul#(2, TDiv#(lv_rnd_sz, dw))))) rg_outp_cnt <- mkReg(0);

        // memory mapped regs
        Vector#(TMul#(2, TDiv#(lv_rnd_sz, dw)), DCRAddr#(aw, 2)) attr_output;

        // internal
        Bit#(aw) lv_last_inp_addr;
        Bit#(aw) lv_last_outp_addr;

        for (Integer i = 0, i < valueOf(TDiv#(lv_rnd_sz, dw)) )


    endmodule: mk_ECC_config_regs

    module [Module] mkecc_block#(Integer inp_depth, Integer out_depth) (IWithDCBus#(DCBus#(aw,dw), Ifc_AES#(n_sbox))) provisos (
        Div#(128,dw,num_inp_regs),
        Div#(256,dw,num_key_regs),
        Mul#(TDiv#(dw,8),8,dw),
        Add#(a__,2,aw),
        Add#(b__, TDiv#(dw,8),8),
        Add#(dw, c__, 64),
        Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
        Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
        Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256));
        let ifc <- exposeDCBusIFC(mkecc_config_regs(inp_depth, out_depth));
        return ifc;
    endmodule

    module [Module] mkecc_axi4l#(parameter Integer inp_depth, parameter Integer out_depth,
    parameter Integer base, Clock ecc_clk, Reset ecc_rst) (Ifc_ecc_axi4l#(aw,dw,uw,n_sbox)) provisos (
        Div#(128,dw,num_inp_regs),
        Div#(256,dw,num_key_regs),
        Mul#(TDiv#(dw,8),8,dw),
        Add#(a__,2,aw),
        Add#(b__, TDiv#(dw,8),8),
        Add#(dw, c__, 64),
        Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
        Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
        Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256));
        let temp_ecc_mod = mkecc_block(clocked_by ecc_clk, reset_by ecc_rst, inp_depth, out_depth);
        Ifc_ecc_axi4l#(aw, dw, uw, n_sbox) ecc_mod <- dc2axi4l(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule

    module [Module] mkecc_axi4#(parameter Integer inp_depth, parameter Integer out_depth,
    parameter Integer base, Clock ecc_clk, Reset ecc_rst) (Ifc_ecc_axi4#(iw,aw,dw,uw,n_sbox)) provisos (
        Div#(128,dw,num_inp_regs),
        Div#(256,dw,num_key_regs),
        Mul#(TDiv#(dw,8),8,dw),
        Add#(a__,2,aw),
        Add#(b__, TDiv#(dw,8),8),
        Add#(dw, c__, 64),
        Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
        Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
        Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256));
        let temp_ecc_mod = mkecc_block(clocked_by ecc_clk, reset_by ecc_rst, inp_depth, out_depth);
        Ifc_ecc_axi4#(iw, aw, dw, uw, n_sbox) ecc_mod <- dc2axi4(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule

    module [Module] mkecc_apb#(parameter Integer inp_depth, parameter Integer out_depth,
        parameter Integer base, Clock ecc_clk, Reset ecc_rst) (Ifc_ecc_apb#(aw,dw,uw,n_sbox)) provisos (
        Div#(128,dw,num_inp_regs),
        Div#(256,dw,num_key_regs),
        Mul#(TDiv#(dw,8),8,dw),
        Add#(a__,2,aw),
        Add#(b__, TDiv#(dw,8),8),
        Add#(dw, c__, 64),
        Add#(TExp#(TLog#(dw)),0,dw), // bus-side should be a power of 2.
        Bits#(Vector::Vector#(num_inp_regs, Bit#(dw)), 128),
        Bits#(Vector::Vector#(num_key_regs, Bit#(dw)), 256));
        let temp_ecc_mod = mkecc_block(clocked_by ecc_clk, reset_by ecc_rst, inp_depth, out_depth);
        Ifc_ecc_apb#(aw, dw, uw, n_sbox) ecc_mod <- dc2apb(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule

    /*(*synthesize*)
    module mkinst_ecc_axi4l(Ifc_ecc_axi4l#(32, 32, 0, 16));
    let curr_clk <- exposeCurrentClock;
    let curr_reset <- exposeCurrentReset;
    let ifc();
    mkecc_axi4l#(4, 4, 'h12300, curr_clk, curr_reset) _temp(ifc);
    return ifc;
    endmodule*/

endpackage: ECC