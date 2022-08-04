package TB;

    import pubkey_gen :: * ;

    module mk_TB(Empty);

        Ifc_pubkey_gen pkgen <- mk_pubkey_gen(233'h3);
        Reg#(Bit#(64)) cycles <- mkReg(0);
        rule pkgen_start;
            pkgen.ma_request_ops();
        endrule: pkgen_start

        rule cycle_count;
            cycles <= cycles + 1;
        endrule: cycle_count

        rule pkgen_recv;
            let pk = pkgen.mv_pubkey();
            $display("Px = %x\nPy = %x\nCycles = %d", tpl_1(pk), tpl_2(pk), cycles);
            $finish(0);
        endrule: pkgen_recv

    endmodule: mk_TB

endpackage: TB