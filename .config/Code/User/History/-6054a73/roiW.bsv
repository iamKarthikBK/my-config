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
    import Vector :: * ;

    module mk_TB(Empty);

        Reg#(Bit#(64)) cycles <- mkReg(0);
        rule cycle_count;
            // $display("1 Cycle Elapsed");
            cycles <= cycles + 1;
        endrule: cycle_count

        // ---------

        // Ifc_pubkey_gen pkgen <- mk_pubkey_gen(233'h3);
        // rule pkgen_start;
        //     pkgen.ma_start();
        // endrule: pkgen_start

        // rule pkgen_recv;
        //     let pk = pkgen.mv_pubkey();
        //     $display("Px = %x\nPy = %x\nCycles = %d", tpl_1(pk), tpl_2(pk), cycles);
        //     $finish(0);
        // endrule: pkgen_recv

        // ----------

        // PubKeyGenState pk_state = TRANSFORM;
        // Wrapper#(FFE, FFE)          gf_square <- mkUniqueWrapper(fn_square);
        // Ifc_multiplier              gf_mul <- mk_multiplier();
        // Ifc_inverse                 gf_inv <- mk_inverse(gf_mul, pk_state);

        // Reg#(Bit#(4)) state <- mkReg(0);

        // FFE a = 233'b11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111;
        // rule sq;
        //     $display("a: %b", a);
        //     let ans <- gf_square.func(a);
        //     $display("With zeroes: %b", fn_insert_zeroes(a));
        //     $display("sq: %b", ans);
        //     $finish(0);
        // endrule: sq
        // rule inv_start (state == 0);
        //     gf_inv.ma_wait();
        //     gf_inv.ma_start(a);
        //     state <= 1;
        //     $display("Cycles: %d", cycles);
        // endrule: inv_start

        // rule mul_verif (state == 1);
        //     $display("Cycles: %d", cycles);
        //     let inv_result <- gf_inv.mav_result();
        //     $display("inv_result: %h", inv_result);
        //     gf_mul.ma_start(inv_result, a);
        //     state <= 2;
        // endrule: mul_verif

        // rule mul_verif_recv (state == 2);
        //     gf_mul.ma_wait();
        //     let mul_result = gf_mul.mv_result();
        //     $display("mul_result: %h", mul_result);
        //     $display("cycles: %d", cycles);
        //     $finish(0);
        // endrule: mul_verif_recv

        // ----------

        // ----------

        // PubKeyGenState pk_state = COMPUTE;
        // Ifc_multiplier gf_mul <- mk_multiplier();
        // Bool st_add = False; // False for Point Double
        // Vector#(5, Reg#(FFE)) v <- replicateM(mkConfigReg(0));

        // Ifc_point_add pa_block <- mk_point_add(gf_mul, pk_state, st_add, v);
        // TPoint p = TPoint{x: 233'h1, y: 233'h2, z: 233'h3};
        // Reg#(Bit#(4)) rg_state <- mkConfigReg(0);

        // rule rl_pa_start if (rg_state == 0);
        //     $display("Cycles: %d", cycles);
        //     pa_block.ma_point_add_start(p);
        //     rg_state <= 1;
        // endrule: rl_pa_start

        // rule rl_pa_recv if (rg_state == 1);
        //     pa_block.ma_wait();
        //     let res = pa_block.mv_point_add_result();
        //     rg_state <= 2;
        //     $display("Cycles: %d", cycles);
        //     $finish(0);
        // endrule: rl_pa_recv

        // Ifc_point_double pd_block <- mk_point_double(gf_mul, pk_state, st_add, v);
        // TPoint p = TPoint{x: 233'h1, y: 233'h2, z: 233'h3};
        // Reg#(Bit#(4)) rg_state <- mkConfigReg(0);

        // rule rl_pd_start if (rg_state == 0);
        //     $display("Cycles: %d", cycles);
        //     pd_block.ma_point_double_start(p);
        //     rg_state <= 1;
        // endrule: rl_pd_start

        // rule rl_pd_recv if (rg_state == 1);
        //     pd_block.ma_wait();
        //     let res = pd_block.mv_point_double_result();
        //     rg_state <= 2;
        //     $display("Cycles: %d", cycles);
        //     $finish(0);
        // endrule: rl_pd_recv
        // ----------

        // ---
        PubKeyGenState pk_state = TRANSFORM;
        Ifc_multiplier gf_mul <- mk_multiplier();

        Ifc_transform_pa trans <- mk_transform_pa(gf_mul, pk_state);

        TPoint p = TPoint{x: 233'h1, y: 233'h2, z: 233'h3};
        Reg#(Bit#(4)) rg_state <- mkConfigReg(0);

        rule rl_trans_start if (rg_state == 0);
            $display("Cycles: %d", cycles);
            trans.ma_transform_pa(p);
            rg_state <= 1;
        endrule: rl_trans_start

        rule rl_trans_recv if (rg_state == 1);
            let res <- trans.mav_result();
            $display("Cycles: %d", cycles);
            rg_state <= 2;
            $finish(0);
        endrule: rl_trans_recv
        // ---

    endmodule: mk_TB

endpackage: TB