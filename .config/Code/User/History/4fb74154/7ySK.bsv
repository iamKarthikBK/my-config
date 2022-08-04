package Tb;
    import pubkey_gen :: * ;

    module mkTb (Empty);
        Ifc_pubkey_gen pkgen <- mk_pubkey_gen();

        rule start;
            $display ("Hello World! The answer is: %0d", ifc.the_answer (10, 15, 17));
            $finish (0);
        endrule
    endmodule: mkTb
endpackage: Tb