package pubkey_gen;

    `include "accel.defines"
    import scalar_mult :: * ;
    import group_ops :: * ;
    import inverse :: * ;
    import multiplier :: * ;
    import transformation :: * ;
    import primitives :: * ;
    import UniqueWrappers :: * ;
    import ConfigReg :: * ;

    /*doc:interface: provides the interface for generating a public key*/
    interface Ifc_pubkey_gen;
        method Action ma_start ();
        method Action ma_wait ();
        method Bool mv_idle ();
        method Bool mv_done ();
        method Tuple2#(FFE, FFE) mv_pubkey ();
    endinterface: Ifc_pubkey_gen

    (* preempts = "rl_transform_pa, rl_trans_pa_recv" *)
    (* preempts = "rl_obtain_pubkey, rl_transform_pa" *)
    (* preempts = "rl_obtain_pubkey, rl_trans_pa_recv" *)

    /*doc:module: implements the public key generation protocol in HW*/
    module mk_pubkey_gen#(FFE priv_key)(Ifc_pubkey_gen);

        /*doc:reg: holds the state of Public Key Generation HW*/
        Reg#(PubKeyGenState) rg_pk_gen_state <- mkConfigReg(IDLE);

        /*doc:reg: holds the waiting status*/
        Reg#(Bool) rg_wait <- mkReg(False);

        /*doc:reg: holds a Maybe type value of the public key in projective system*/
        Reg#(Maybe#(TPoint)) rg_pubkey_p <- mkReg(tagged Invalid);

        /*doc:reg: holds a Maybe type value of the public key in affine system*/
        Reg#(Maybe#(TPointA)) rg_pubkey <- mkReg(tagged Invalid);

        Ifc_multiplier   gf_mul <- mk_multiplier();
        Ifc_transform_ap trans_ap <- mk_transform_ap();
        Ifc_transform_pa trans_pa <- mk_transform_pa(gf_mul, rg_pk_gen_state);
        Ifc_scalar_mult  ecsmul <- mk_scalar_mult(gf_mul, trans_ap, rg_pk_gen_state);

        /*doc:rule: wait for the multi-cycle scalar mult operation to complete and mark as Valid*/
        rule rl_obtain_pubkey if (!isValid(rg_pubkey) && rg_pk_gen_state == COMPUTE);
            let pubkey_p <- ecsmul.mav_result();
            rg_pubkey_p <= tagged Valid (pubkey_p);
            rg_pk_gen_state <= TRANSFORM;
        endrule: rl_obtain_pubkey

        /*doc:rule: transform the co-ordinates from projective to affine*/
        rule rl_transform_pa if (isValid(rg_pubkey_p) && !isValid(rg_pubkey) && rg_pk_gen_state == TRANSFORM && rg_wait == False);
            trans_pa.ma_transform_pa(fromMaybe(TPoint{x: 0, y: 0, z: 0}, rg_pubkey_p));
            rg_wait <= True;
        endrule: rl_transform_pa

        /*doc:rule: recieve the result of multi cycle transformation from P to A*/
        rule rl_trans_pa_recv if (rg_pk_gen_state == TRANSFORM && rg_wait == True);
            let transformed <- trans_pa.mav_result();
            rg_pubkey <= tagged Valid (transformed);
            rg_pk_gen_state <= IDLE;
        endrule: rl_trans_pa_recv

        /*doc:method: loads the provate key, invokes multiplication, marks public key Invalid*/
        method Action ma_start () if (rg_pk_gen_state == IDLE);
            rg_pubkey <= tagged Invalid;
            rg_pubkey_p <= tagged Invalid;
            rg_pk_gen_state <= COMPUTE;
            rg_wait <= False;
            ecsmul.ma_scalar_mult(priv_key);
        endmethod: ma_start

        method Action ma_wait () if (rg_pk_gen_state == IDLE);
            noAction;
        endmethod: ma_wait

        method Bool mv_done ();
            return (isValid(rg_pubkey)) ? True : False;
        endmethod: mv_done

        method Bool mv_idle ();
            return (rg_pk_gen_state == IDLE) ? True : False;
        endmethod: mv_idle

        /*doc:method: return the Maybe type value of pubkey*/
        method Tuple2#(FFE, FFE) mv_pubkey if (isValid(rg_pubkey));
            let lv_maybe_pubkey = fromMaybe(TPointA{x: 0, y: 0}, rg_pubkey);
            return tuple2(lv_maybe_pubkey.x, lv_maybe_pubkey.y);
        endmethod: mv_pubkey
    endmodule: mk_pubkey_gen

endpackage: pubkey_gen