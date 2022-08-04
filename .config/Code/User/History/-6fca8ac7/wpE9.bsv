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
    import Vector :: * ;

    /*doc:interface: provides the interface for generating a public key*/
    interface Ifc_pubkey_gen;
        method Action ma_request_ops ();
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
        Reg#(TPoint) rg_pubkey_p <- mkReg(defaultValue);

        /*doc:vector: 2 registers that hold the public key in affine co-ordinates*/
        Vector#(2, Reg#(FFE)) v_trans <- replicateM(mkReg(0));

        Ifc_multiplier   gf_mul <- mk_multiplier();
        Ifc_transform_ap trans_ap <- mk_transform_ap();
        Ifc_transform_pa trans_pa <- mk_transform_pa(gf_mul, rg_pk_gen_state, rg_pubkey_p, v_trans);
        Ifc_scalar_mult  ecsmul <- mk_scalar_mult(gf_mul, trans_ap, rg_pk_gen_state);

        /*doc:rule: wait for the multi-cycle scalar mult operation to complete and mark as Valid*/
        rule rl_obtain_pubkey if (!isValid(rg_pubkey) && rg_pk_gen_state == COMPUTE);
            let pubkey_p <- ecsmul.mav_result();
            rg_pubkey_p <= tagged Valid (pubkey_p);
            rg_pk_gen_state <= TRANSFORM;
        endrule: rl_obtain_pubkey

        /*doc:rule: transform the co-ordinates from projective to affine*/
        rule rl_transform_pa if (isValid(rg_pubkey_p) && !isValid(rg_pubkey) && rg_pk_gen_state == TRANSFORM && rg_wait == False);
            trans_pa.ma_transform_pa();
            rg_wait <= True;
        endrule: rl_transform_pa

        /*doc:rule: recieve the result of multi cycle transformation from P to A*/
        rule rl_trans_pa_recv if (rg_pk_gen_state == TRANSFORM && rg_wait == True);
            trans_pa.mav_result();
            rg_pk_gen_state <= IDLE;
        endrule: rl_trans_pa_recv

        /*doc:method: loads the provate key, invokes multiplication, marks public key Invalid*/
        method Action ma_request_ops () if (rg_pk_gen_state == IDLE);
            rg_pk_gen_state <= COMPUTE;
            rg_wait <= False;
            ecsmul.ma_scalar_mult(priv_key);
        endmethod: ma_request_ops

        /*doc:method: return the Maybe type value of pubkey*/
        method Tuple2#(FFE, FFE) mv_pubkey if (rg_pk_gen_state == IDLE);
            return tuple2(v_trans[0], v_trans[1]);
        endmethod: mv_pubkey
    endmodule: mk_pubkey_gen

endpackage: pubkey_gen