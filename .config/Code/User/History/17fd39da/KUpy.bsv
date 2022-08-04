package group_ops;

    `include "accel.defines"

    import primitives       :: * ;
    import multiplier       :: * ;
    import inverse          :: * ;
    import UniqueWrappers   :: * ;
    import Vector           :: * ;
    import ConfigReg        :: * ;

    /*doc:interface: provides the interface for point doubling*/
    interface Ifc_point_double;
        method Action ma_point_double_start  (TPoint to_double);
        method Action ma_wait   ();
        method TPoint mv_point_double_result ();
    endinterface: Ifc_point_double

    /*doc:enum: provides the state for point double state machine*/
    typedef enum {IDLE, D1, D1_wait, D2, D2_wait, D3, D3_wait, D4, D4_wait, /*D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15, DRDY, */DONE} PointDoubleState deriving (Bits, Eq);

    /*doc:module: implements the group ops HW. Accepts:
    1. Squarer
    2. Multiplier
    3. Adder
    4. Public Key Generation State
    as interface arguements*/
    module mk_point_double#(Ifc_multiplier gf_mul,
                            PubKeyGenState pk_gen_state,
                            Bool st_add,
                            Vector#(5, Reg#(FFE)) v)
                            (Ifc_point_double);

        /*doc:reg: Stores Point to double*/
        Reg#(TPoint) rg_to_double <- mkReg(defaultValue);

        FFE a = `curve_a;
        FFE b = `curve_b;

        /*doc:reg: Stores the state of point double computation*/
        Reg#(PointDoubleState) rg_pd_state <- mkConfigReg(IDLE);

        /*doc:rule: state machine for point doubling and additon (sequential)*/
        rule rl_compute if (rg_pd_state != IDLE && rg_pd_state != DONE && pk_gen_state == COMPUTE && st_add == False);
            case (rg_pd_state)
                D1:
                begin
                    gf_mul.ma_start(fn_square(rg_to_double.x), fn_square(rg_to_double.z));
                    v[1] <= fn_square(fn_square(rg_to_double.z)); // RB3
                end
                D1_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[0] <= lv_mul_res; // RC1
                end
                D2:
                begin
                    gf_mul.ma_start(v[1], b);
                end
                D2_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[1] <= lv_mul_res; // RB3
                end
                D3:
                begin
                    let lv_add_res = fn_xor(fn_square(fn_square(rg_to_double.x)), v[1]);
                    v[2] <= lv_add_res; // RA1
                    gf_mul.ma_start(fn_xor(fn_xor(v[0], v[1]), fn_square(rg_to_double.y)), lv_add_res);
                end
                D3_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[3] <= lv_mul_res; // RC2
                end
                D4:
                begin
                    gf_mul.ma_start();
                end
                D4_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[4] <= fn_xor(lv_mul_res, v[3]); // RB1
                end
                // D1:     sq  (0, rg_to_double.x);
                // D2:     sq  (1, rg_to_double.z);
                // D3:     mul (2, v[0], v[1]);
                // D4:     sq  (0, v[0]);
                // D5:     sq  (1, v[1]);
                // D6:     mul (1, v[1], b);
                // D7:     add (3, v[1], v[0]);
                // D8:     mul (4, v[1], v[2]);
                // D9:     mul (0, v[2], a);
                // D10:    sq  (5, rg_to_double.y);
                // D11:    add (5, v[5], v[1]);
                // D12:    add (5, v[5], v[0]);
                // D13:    mul (5, v[3], v[5]);
                // D14:    mul (1, v[1], v[2]);
                // D15:    add (5, v[5], v[1]);
                // DRDY:   rg_point_pd_result <= TPoint{x: v[3], y: v[5], z: v[2]};
            endcase 
            rg_pd_state <= unpack(pack(rg_pd_state) + 1);
        endrule: rl_compute

        /*doc:method: stores operands into registers and changes state to D1*/
        method Action ma_point_double_start(TPoint to_double);
            rg_to_double <= to_double;
            rg_pd_state <= D1;
        endmethod: ma_point_double_start

        /*doc:method: wait till state is DONE*/
        method Action ma_wait () if (rg_pd_state == IDLE || rg_pd_state == DONE);
            noAction;
        endmethod: ma_wait

        /*doc:method: returns point doubling result*/
        method TPoint mv_point_double_result() if (rg_pd_state == DONE);
            return TPoint{x: v[2], y: v[4], z: v[0]};
        endmethod: mv_point_double_result

    endmodule: mk_point_double

    /*doc:interface: provides the interface for point addition*/
    interface Ifc_point_add;
        method Action ma_point_add_start  (TPoint to_add);
        method Action ma_wait   ();
        method TPoint mv_point_add_result ();
    endinterface: Ifc_point_add

    /*doc:enum: provides the state for point addition state machine*/
    typedef enum {IDLE, A1, A2, A3, A4, A5, A6, A7, A8,/* A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20, A21, A22, A23, ARDY,*/ DONE} PointAddState deriving (Bits, Eq);

    module mk_point_add#(   Ifc_multiplier gf_mul,
                            PubKeyGenState pk_gen_state,
                            Bool st_add,
                            Vector#(5, Reg#(FFE)) v)
                            (Ifc_point_add);

        /*doc:reg: Stores Point to add*/
        Reg#(TPoint) rg_to_add <- mkReg(defaultValue);

        /*doc:const: Stores point Q in Affine co-ordinates*/
        FFE addend_A_x = fromInteger(valueOf(`Gx));
        FFE addend_A_y = fromInteger(valueOf(`Gy));

        FFE a = `curve_a;
        FFE b = `curve_b;


        /*doc:reg: Stores the state of point add computation*/
        Reg#(PointAddState) rg_state <- mkConfigReg(IDLE);

        /*doc:rule: state machine for point additon (sequential)*/
        rule rl_compute if (rg_state != IDLE && rg_state != DONE && pk_gen_state == COMPUTE && st_add == True);
            case (rg_state)
                A1:
                begin
                    gf_mul.ma_start(addend_A_y, fn_square(rg_to_add.z));
                end
                A1_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[0] <= fn_xor(lv_mul_res, rg_to_add.y); // RB1
                end
                A2:
                begin
                    gf_mul.ma_start(addend_A_x, rg_to_add.z);
                end
                A2_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[1] <= fn_xor(lv_mul_res, rg_to_add.x); // RA1
                end
                A3:
                begin
                    gf_mul.ma_start(rg_to_add.z, v[1]);
                end
                A3_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[2] <= lv_mul_res; // RB3
                end
                A4:
                begin
                    gf_mul.ma_start(fn_square(v[1]), fn_xor(v[2], fn_square(rg_to_add.z)));
                end
                A4_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[1] <= lv_mul_res; // RA1
                end
                A5:
                begin
                    gf_mul.ma_start(v[0], v[2]);
                end
                A5_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[3] <= lv_mul_res; // RC2
                    v[1] <= fn_xor(fn_xor(v[1], lv_mul_res), fn_square(v[0])); // RA1
                end
                A6:
                begin
                    let lv_square_res = fn_square(v[2]);
                    v[4] <=  lv_square_res; // RC1
                    gf_mul.ma_start(lv_square_res, addend_A_x);
                end
                A6_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[2] <= fn_xor(lv_mul_res, v[1]); //RB3
                end
                A7:
                begin
                    gf_mul.ma_start(fn_square(v[4]), fn_xor(addend_A_x, addend_A_y));
                end
                A7_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[0] <= lv_mul_res; //RB1
                end
                A8:
                begin
                    let lv_mul_res <- gf_mul.mav_multiply(fn_xor(v[3], v[4]), v[2]);
                    v[0] <= fn_xor(lv_mul_res, v[0]); //RB1
                end
                A8_wait:
                begin
                    let lv_mul_res = gf_mul.mv_result();
                    v[1] <= lv_mul_res; //RA1
                end
                // A1:     sq  (0, rg_to_add.z);
                // A2:     mul (1, v[0], addend_A_y);
                // A3:     mul (2, rg_to_add.z, addend_A_x);
                // A4:     add (1, v[1], rg_to_add.y);
                // A5:     add (2, v[2], rg_to_add.x);
                // A6:     mul (3, v[2], rg_to_add.z);
                // A7:     sq  (2, v[2]);
                // A8:     mul (0, v[0], a);
                // A9:     add (0, v[0], v[3]);
                // A10:    mul (2, v[2], v[0]);
                // A11:    mul (0, v[1], v[3]);
                // A12:    sq  (1, v[1]);
                // A13:    add (2, v[2], v[0]);
                // A14:    add (1, v[1], v[2]);
                // A15:    sq  (3, v[3]);
                // A16:    mul (2, v[3], addend_A_x);
                // A17:    add (2, v[2], v[1]);
                // A18:    add (0, v[0], v[3]);
                // A19:    mul (0, v[0], v[2]);
                // A20:    add (2, addend_A_x, addend_A_y);
                // A21:    sq  (4, v[3]);
                // A22:    mul (2, v[2], v[4]);
                // A23:    add (2, v[2], v[0]);
                // ARDY:   rg_point_pa_result <= TPoint{x: v[1], y: v[2], z: v[3]};
            endcase 
            rg_state <= unpack(pack(rg_state) + 1);
        endrule: rl_compute

        /*doc:method: stores operands into registers and changes state to D1*/
        method Action ma_point_add_start(TPoint to_add);
            rg_to_add <= to_add;
            rg_state <= A1;
        endmethod: ma_point_add_start

        /*doc:method: wait till state is DONE*/
        method Action ma_wait () if (rg_state == IDLE || rg_state == DONE);
            noAction;
        endmethod: ma_wait

        /*doc:method: returns a tuple of points R and S for P+R and 2P*/
        method TPoint mv_point_add_result() if (rg_state == DONE);
            return TPoint{x: v[1], y: v[0], z: v[4]};
        endmethod: mv_point_add_result

    endmodule: mk_point_add


endpackage: group_ops