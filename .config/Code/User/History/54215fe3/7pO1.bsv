package ECC;

    import pubkey_gen :: * ;
    import axi4 :: * ;
    import axi4l :: * ;
    import apb :: * ;
    import DCBus :: * ;
    import Reserved :: * ;
    import Vector :: * ;
    import ConfigReg :: * ;

    `include "accel.defines"

    /*doc:interface: provides the interface for ECC*/
    interface Ifc_ECC;
        method Bool mv_idle;
        method Bool mv_output_ready;
    endinterface: Ifc_ECC

    /*doc:interface: provides interface for ECC with axi4 slave*/
    typedef IWithSlave#(Ifc_axi4_slave#(iw, aw, dw, uw), Ifc_ECC) Ifc_ecc_axi4#(type iw, type aw, type dw, type uw);

    /*doc:interface: provides interface for ECC with axi4l slave*/
    typedef IWithSlave#(Ifc_axi4l_slave#(aw, dw, uw), Ifc_ECC) Ifc_ecc_axi4l#(type aw, type dw, type uw);

    /*doc:interface: provides interface for ECC with apb slave*/
    typedef IWithSlave#(Ifc_apb_slave#(aw, dw, uw), Ifc_ECC) Ifc_ecc_apb#(type aw, type dw, type uw);

    /*doc:struct: structure of the ECC control status register*/
    typedef struct {
        ReservedZero#(30) rzeroes;
        Bool idle;
        Bool outp_ready;
    } ECC_status deriving (Bits, Eq, FShow);

    /*doc:struct: structure of the EC scalar register*/
    typedef struct {
        ReservedZero#(23) rzeroes;
        Bit#(`KeySize) scalar;
    } ECC_scalar deriving (Bits, Eq, FShow);

    /*doc:module: contains the config registers for commuinicating with the ECC peripheral*/
    module [ModWithDCBus#(aw, dw)] mkecc_config_regs(Ifc_ECC) provisos (
        Add#(TExp#(TLog#(dw)),0,dw),
        Add#(a__, 2, aw),
        Mul#(TDiv#(dw, 8), 8, dw),
        Add#(dw, b__, 64),
        Add#(c__, TDiv#(dw, 8), 8),
        Add#(d__, 41, dw),
        Bits#(Vector::Vector#(4, Bit#(dw)), e__),
        Add#(f__, 233, e__)
    );
        
        /*doc:reg: holds the count of the number of input chunks recieved*/
        Reg#(Bit#(3)) rg_inp_cnt <- mkReg(0);

        /*doc:reg: holds the count of the number of output chunks sent*/
        Reg#(Bit#(4)) rg_outp_cnt <- mkReg(0);

        /*doc:vector: memory mapped registers for input side*/
        Vector#(4, DCRAddr#(aw, 2)) v_attr_inp;

        /*doc:vector: memory mapped registers for output side*/
        Vector#(8, DCRAddr#(aw, 2)) v_attr_outp;

        /*doc:vector: holds input data*/
        Vector#(4, Reg#(Bit#(64))) v_rg_inp_data;

        /*doc:vector: holds output data*/
        Vector#(8, Reg#(Bit#(64))) v_rg_outp_data;

        /*doc:wire: indicates new input chunk being recieved*/
        Wire#(Bool) wr_new_inp <- mkDWire(False);

        /*doc:wire: indicates output chunk being read*/
        Wire#(Bool) wr_outp_read <- mkDWire(False);

        Bit#(aw) lv_last_inp_addr;
        let lv_next_inp_addr = valueOf(dw);

        /*doc:reg: holds the private key for further computation*/
        Reg#(ECC_scalar) rg_privkey <- mkConfigReg(unpack(0));

        /*doc:reg: holds the status of input on DCBus side*/
        Reg#(Bool) rg_DCBusIRDY <- mkConfigReg(False);

        /*doc:reg: holds the status of output on DCBus side*/
        Reg#(Bool) rg_DCBusORDY <- mkConfigReg(False);

        /*doc:reg: holds the status of pkgen idle*/
        Reg#(Bool) rg_pkgen_idle <- mkConfigReg(False);

        for (Integer i = 0; i < 4; i = i + 1) begin
            let i4 = fromInteger(i) * 8;
            let inc = fromInteger(lv_next_inp_addr);
            v_attr_inp[i] = DCRAddr{addr: i4, min: Sz1, max: Sz8, mask: 'b00, wr_perm: PvU, rd_perm: PvM};
            lv_last_inp_addr = (2 * inc) + i4 + 8;
        end

        for (Integer i = 0; i < 8; i = i + 1) begin
            let i4 = fromInteger(i) * 8;
            let inc = fromInteger(lv_next_inp_addr);
            v_attr_outp[i] = DCRAddr{addr: inc + i4, min: Sz1, max: Sz8, mask: 'b00, wr_perm: ?, rd_perm: PvU};
        end

        DCRAddr#(aw, 2) attr_status = DCRAddr{addr: lv_last_inp_addr, min: Sz1, max: Sz8, mask: 'b00, wr_perm: ?, rd_perm: PvU};

        /*doc:reg: holds the status of ECC peripheral in a RO register*/
        Reg#(ECC_status) rg_status <- mkDCBRegRO(attr_status, unpack(0));

        for (Integer i = 0; i < 4; i = i + 1) begin
            v_rg_inp_data[i] <- mkDCBRegRWSe(v_attr_inp[i], 0, wr_new_inp._write(True));
            v_rg_outp_data[i] <- mkDCBRegROSe(v_attr_outp[i], 0, wr_outp_read._write(True));
        end

        Ifc_pubkey_gen pkgen <- mk_pubkey_gen(rg_privkey.scalar);

        /*doc:rule: fires every cycle and queries the status of pkgen module.*/
        rule rl_update_status;
            let lv_idle = pkgen.mv_idle();
            let lv_outp_ready = pkgen.mv_done();
            rg_status <= ECC_status{idle: lv_idle, outp_ready: lv_outp_ready};
        endrule: rl_update_status

        /*doc:rule: fires every cycle and sets the value in counter reg*/
        rule rl_set_counter;
            if (wr_new_inp && (rg_inp_cnt == 4))
                rg_inp_cnt <= 1;
            else if (wr_new_inp)
                rg_inp_cnt <= rg_inp_cnt + 1;
            else if (rg_outp_cnt == 4)
                rg_outp_cnt <= 0;
        endrule: rl_set_counter

        /*doc:rule: sets the inp_ready (internal) status if inp_cnt == 4*/
        rule rl_set_inp_ready if (rg_inp_cnt == 4);
            rg_privkey <= ECC_scalar{scalar:truncate(pack(readVReg(v_rg_inp_data)))};
            rg_DCBusIRDY <= True;
        endrule: rl_set_inp_ready

        /*doc:rule: sets the outp_ready (internal) status if pkgen module done*/
        rule rl_set_outp_ready if (pkgen.mv_done());
            rg_DCBusORDY <= True;
        endrule: rl_set_outp_ready

        /*doc:rule: sets the idle (internal) status if pkgen module idle*/
        rule rl_set_idle if (pkgen.mv_idle());
            rg_pkgen_idle <= True;
        endrule: rl_set_idle

        /*doc:rule: invokes the start method in pkgen module if inp_ready*/
        rule rl_start_pkgen if (rg_DCBusIRDY == True);
            pkgen.ma_start();
        endrule: rl_start_pkgen

        /*doc:rule: obtain pubkey when ready*/
        rule rl_get_pubkey if (pkgen.mv_done() == True);
            let lv_pubkey_x = '0;
            let lv_pubkey_y = '0;
            {lv_pubkey_x, lv_pubkey_y} = pkgen.mv_pubkey();
            v_rg_outp_data[0] <= lv_pubkey_x[232 : 169];
            v_rg_outp_data[1] <= lv_pubkey_x[168 : 105];
            v_rg_outp_data[2] <= lv_pubkey_x[104 : 41];
            v_rg_outp_data[3] <= zeroExtend(lv_pubkey_x[40 : 0]);
            v_rg_outp_data[4] <= lv_pubkey_y[232 : 169];
            v_rg_outp_data[5] <= lv_pubkey_y[168 : 105];
            v_rg_outp_data[6] <= lv_pubkey_y[104 : 41];
            v_rg_outp_data[7] <= zeroExtend(lv_pubkey_y[40 : 0]);
        endrule: rl_get_pubkey

        /*doc:method: returns the value of idle status reg*/
        method mv_idle;
            return rg_pkgen_idle;
        endmethod: mv_idle

        /*doc:method: returns the value of outp_ready (internal) status reg*/
        method mv_output_ready;
            return rg_DCBusORDY;
        endmethod: mv_output_ready
    endmodule: mkecc_config_regs

    /*doc:module: exposes the DCBus interface for ECC peripheral*/
    module [Module] mk_ecc(IWithDCBus#(DCBus#(aw,dw), Ifc_ECC))provisos (
        Add#(TExp#(TLog#(dw)),0,dw),
        Add#(a__, 2, aw),
        Mul#(TDiv#(dw, 8), 8, dw),
        Add#(dw, b__, 64),
        Add#(c__, TDiv#(dw, 8), 8),
        Add#(d__, 41, dw),
        Bits#(Vector::Vector#(4, Bit#(dw)), e__),
        Add#(f__, 233, e__)
    );
        let ifc <- exposeDCBusIFC(mkecc_config_regs);
        return ifc;
    endmodule: mk_ecc

    /*doc:module: provides the axi4 slave interface for ECC peripheral*/
    module [Module] mkecc_axi4#(parameter Integer base, Clock ecc_clk, Reset ecc_rst)(Ifc_ecc_axi4#(iw, aw, dw, uw))provisos (
        Add#(TExp#(TLog#(dw)),0,dw),
        Add#(a__, 2, aw),
        Mul#(TDiv#(dw, 8), 8, dw),
        Add#(dw, b__, 64),
        Add#(c__, TDiv#(dw, 8), 8),
        Add#(d__, 41, dw),
        Bits#(Vector::Vector#(4, Bit#(dw)), e__),
        Add#(f__, 233, e__)
    );
        let temp_ecc_mod = mk_ecc(clocked_by ecc_clk, reset_by ecc_rst);
        Ifc_ecc_axi4#(iw, aw, dw, uw) ecc_mod <- dc2axi4(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule: mkecc_axi4

    /*doc:module: provides the axi4l slave interface for ECC peripheral*/
    module [Module] mkecc_axi4l#(parameter Integer base, Clock ecc_clk, Reset ecc_rst)(Ifc_ecc_axi4l#(aw, dw, uw))provisos (
        Add#(TExp#(TLog#(dw)),0,dw),
        Add#(a__, 2, aw),
        Mul#(TDiv#(dw, 8), 8, dw),
        Add#(dw, b__, 64),
        Add#(c__, TDiv#(dw, 8), 8),
        Add#(d__, 41, dw),
        Bits#(Vector::Vector#(4, Bit#(dw)), e__),
        Add#(f__, 233, e__)
    );
        let temp_ecc_mod = mk_ecc(clocked_by ecc_clk, reset_by ecc_rst);
        Ifc_ecc_axi4l#(aw, dw, uw) ecc_mod <- dc2axi4l(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule: mkecc_axi4l

    /*doc:module: provides the apb interface for ECC peripheral*/
    module [Module] mkecc_apb#(parameter Integer base, Clock ecc_clk, Reset ecc_rst)(Ifc_ecc_apb#(aw, dw, uw))provisos (
        Add#(TExp#(TLog#(dw)),0,dw),
        Add#(a__, 2, aw),
        Mul#(TDiv#(dw, 8), 8, dw),
        Add#(dw, b__, 64),
        Add#(c__, TDiv#(dw, 8), 8),
        Add#(d__, 41, dw),
        Bits#(Vector::Vector#(4, Bit#(dw)), e__),
        Add#(f__, 233, e__)
    );
        let temp_ecc_mod = mk_ecc(clocked_by ecc_clk, reset_by ecc_rst);
        Ifc_ecc_apb#(aw, dw, uw) ecc_mod <- dc2apb(temp_ecc_mod, base, ecc_clk, ecc_rst);
        return ecc_mod;
    endmodule: mkecc_apb
endpackage: ECC