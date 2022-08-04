package TB;

    import scalar_mult :: * ;
    import group_ops :: * ;
    import inverse :: * ;
    import multiplier :: * ;
    import transformation :: * ;
    import primitives :: * ;
    import UniqueWrappers :: * ;
    import ConfigReg :: * ;
    import pubkey_gen :: * ;

    module mk_TB(Empty);

        Reg#(Bit#(64)) cycles <- mkReg(0);
        rule cycle_count;
            cycles <= cycles + 1;
        endrule: cycle_count

        // ---------

        // Ifc_pubkey_gen pkgen <- mk_pubkey_gen(233'h3);
        // rule pkgen_start;
        //     pkgen.ma_request_ops();
        // endrule: pkgen_start

        // rule pkgen_recv;
        //     let pk = pkgen.mv_pubkey();
        //     $display("Px = %x\nPy = %x\nCycles = %d", tpl_1(pk), tpl_2(pk), cycles);
        //     $finish(0);
        // endrule: pkgen_recv

        // ----------

        PubKeyGenState pk_state = TRANSFORM;
        Wrapper#(FFE, FFE)          gf_square <- mkUniqueWrapper(fn_square);
        Ifc_multiplier              gf_mul <- mk_multiplier();
        Ifc_inverse                 gf_inv <- mk_inverse(gf_mul, pk_state);

        FFE a = 233'b11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111;
        // rule sq;
        //     $display("a: %b", a);
        //     let ans <- gf_square.func(a);
        //     $display("With zeroes: %b", fn_insert_zeroes(a));
        //     $display("sq: %b", ans);
        //     $finish(0);
        // endrule: sq
        rule inv_start;
            gf_inv.ma_wait();
            gf_inv.ma_start(a);
        endrule: inv_start

        rule mul_verif;
            let inv_result <- gf_inv.mav_result();
            gf_mul.ma_start(inv_result, a);
        endrule: mul_verif

        rule mul_verif_recv;
            let mul_result = gf_mul.mv_result();
            $display("mul_result: %h", mul_result);
            $finish(0);
        endrule

        // ----------

    endmodule: mk_TB

endpackage: TB