package TB;

    import ModExpt :: * ;

    module mk_TB(Empty);
        ModExpt modexpt <- mkModExpt();

        Reg#(Bit#(64)) cycles <- mkReg(0);
        rule cycle_count;
            // $display("1 Cycle Elapsed");
            cycles <= cycles + 1;
        endrule: cycle_count

    endmodule: mk_TB

endpackage: TB