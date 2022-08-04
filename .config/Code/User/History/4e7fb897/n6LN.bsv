package RegV;

    import Vector :: * ;

    module mkRegV#(dw, rw)() provisos (
        TAdd#(TDiv#(dw, rw), 1), n_regs),
        TSub#(rw)
    );

    Vector#(TAdd#(TDiv#(dw, rw), 1), Bit#(rw)) v_regs <- replicateM(mkReg(0));


    endmodule: mkRegV

endpackage: RegV