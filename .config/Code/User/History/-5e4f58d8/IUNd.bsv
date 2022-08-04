package TB;

    import ModExpt :: * ;
    import ConfigReg :: * ;

    module mk_TB(Empty);
        ModExpt dut <- mkModExpt();
        Reg#(Bit#(2)) rg_state <- mkConfigReg(0);

        Reg#(Bit#(64)) cycles <- mkReg(0);
        rule cycle_count;
            // $display("1 Cycle Elapsed");
            cycles <= cycles + 1;
        endrule: cycle_count

        rule rl_start if (rg_state == 0);
            // $display("Start");
            $display("Cycles: %d", cycles);

            rg_state <= 1;
        endrule: rl_start

    endmodule: mk_TB

endpackage: TB