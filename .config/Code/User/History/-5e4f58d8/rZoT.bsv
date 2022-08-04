package TB;

    import ModExpt :: * ;
    import ConfigReg :: * ;
    import RSAPipelineTypes :: * ;

    module mk_TB(Empty);
        ModExpt dut <- mkModExpt();
        Reg#(Bit#(2)) rg_state <- mkConfigReg(0);
        Vector#(3, BIG_INT) data = {'d211023, 'd101232, 'd25};

        Reg#(Bit#(64)) cycles <- mkReg(0);
        rule cycle_count;
            // $display("1 Cycle Elapsed");
            cycles <= cycles + 1;
        endrule: cycle_count

        rule rl_start if (rg_state == 0);
            $display("Start");
            $display("Cycles: %d", cycles);
            dut.putData(data);
            rg_state <= 1;
        endrule: rl_start

        rule rl_result if (rg_state == 1);
            $display("Result");
            $display("Cycles: %d", cycles);
            let res <- dut.getResult();
            $display("Result: %d", res);
            $finish(0);
        endrule: rl_result

    endmodule: mk_TB

endpackage: TB