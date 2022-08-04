package transformation;

    `include "accel.defines"
    import primitives       :: * ;
    import multiplier       :: * ;
    import inverse          :: * ;
    import StmtFSM          :: * ;
    import UniqueWrappers   :: * ;
    import Vector           :: * ;
    import ConfigReg        :: * ;


    /*doc:function: returns a Tuple3 of the corresponding co-ordinates in
    Lopez-Dahab projective system*/
    function Tuple3#(FFE, FFE, FFE) fn_transform_ap (Tuple2#(FFE, FFE) to_transform);
        FFE z = 1;
        return tuple3(tpl_1(to_transform), tpl_2(to_transform), z);
    endfunction: fn_transform_ap

    /*doc:interface: provides the interface to perform A ~> P transformation*/
    interface Ifc_transform_ap;
        method ActionValue#(Tuple3#(FFE, FFE, FFE)) mav_transform_ap (Tuple2#(FFE, FFE) to_transform);
    endinterface: Ifc_transform_ap

    /*doc:module: Wraps the transform_ap function in a UniqueWrapper for reuse*/
    module mk_transform_ap (Ifc_transform_ap);
        Wrapper#(Tuple2#(FFE, FFE), Tuple3#(FFE, FFE, FFE)) transform_ap <- mkUniqueWrapper(fn_transform_ap);

        /*doc:method: invokes the transform_ap function*/
        method ActionValue#(Tuple3#(FFE, FFE, FFE)) mav_transform_ap (Tuple2#(FFE, FFE) to_transform);
            let ans <- transform_ap.func(to_transform);
            return ans;
        endmethod: mav_transform_ap
    endmodule: mk_transform_ap

    /*doc:interface: provides the interface to perform P ~> A transformation*/
    interface Ifc_transform_pa;
        method Action ma_transform_pa ();
        method Action ma_result ();
    endinterface: Ifc_transform_pa

    /*doc:enum: defines an enumeration for the three axes in transformations*/
    typedef enum {X, Y, Z} TransformationAxis deriving (Bits, Eq);

    (* execution_order = "rl_compute_X, rl_transform_X, rl_compute_Y" *)

    /*doc:module: implements the projective to affine transformation. Accepts:
    1. Multiplier
    2. Squarer
    3. Public Key Generation State
    as interface parameters*/
    module mk_transform_pa#(Ifc_multiplier gf_mul,
                            PubKeyGenState pk_gen_state,
                            Vector#(2, Reg#(FFE)) v_trans,
                            TPoint to_transform)(Ifc_transform_pa);

        /*doc:reg: stores the present axis of transformation*/
        Reg#(TransformationAxis) rg_axis <- mkReg(Z);

        /*doc:reg: stores the value of z inverse*/
        Reg#(FFE) rg_z_inv <- mkReg(0);

        /*doc:reg: stores the status of outputs*/
        Reg#(Bool) rg_rdy <- mkConfigReg(False);

        /*doc:reg: stores the status of multi-cycle waiting*/
        Reg#(Bool) rg_wait <- mkConfigReg(False);

        Ifc_inverse gf_inv <- mk_inverse(gf_mul, pk_gen_state, to_transform.z);

        /*doc:rule: invoke inversion for abcessa computation*/
        rule rl_compute_X if (rg_axis == X && rg_wait == False && pk_gen_state == TRANSFORM);
            gf_inv.ma_wait();
            gf_inv.ma_start();
            rg_wait <= True;
        endrule: rl_compute_X

        /*doc:rule: transforms abcessa and changes axis to Y*/
        rule rl_transform_X if (rg_axis == X && rg_wait == True && pk_gen_state == TRANSFORM);
            let lv_inv <- gf_inv.mav_result();
            rg_z_inv <= lv_inv;
            let lv_mul <- gf_mul.mav_multiply(to_transform.x, lv_inv);
            v_trans[pack(X)] <= lv_mul;
            rg_axis <= Y;
            rg_wait <= False;
        endrule: rl_transform_X

        /*doc:rule: invoke inversion for ordinate computation*/
        rule rl_compute_Y if (rg_axis == Y && rg_wait == False && pk_gen_state == TRANSFORM);
            gf_inv.ma_wait();
            let lv_sq = fn_square(rg_z_inv);
            let lv_mul <- gf_mul.mav_multiply(to_transform.y, lv_sq);
            v_trans[pack(Y)] <= lv_mul;
            rg_rdy <= True;
        endrule: rl_compute_Y

        /*doc:method: waits for inverse HW to be ready, squares Z and changes
        axis to X*/
        method Action ma_transform_pa () if (rg_axis == Z && rg_rdy == False);
            gf_inv.ma_wait();
            rg_axis <= X;
        endmethod: ma_transform_pa

        /*doc:method: returns the affine transformed point of type TPointA*/
        method Action ma_result () if (rg_axis == Y && rg_rdy == True && rg_wait == False);
            rg_rdy <= False;
            rg_axis <= Z;
        endmethod: ma_result

    endmodule: mk_transform_pa

endpackage: transformation