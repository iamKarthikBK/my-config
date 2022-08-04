package Tb;
    import pubkey_gen :: * ;

    module mkTb (Empty);
        Ifc_pubkey_gen pkgen <- mk_pubkey_gen();

        rule start_mod;
            pkgen.ma_request_ops(233'd1);
        endrule: start_mod

        rule end_mod;
            let ans <- pkgen.mav_result();
            $display ("Hello World! The answer is: %0d", );
            $finish (0);
        endrule: end_mod
    endmodule: mkTb
endpackage: Tb