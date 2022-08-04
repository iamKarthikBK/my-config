package RegV;

    import Vector :: * ;

    typedef {
        ReservedZero#(TSub#(dw, TMul#(TDiv#(dw, rw), rw)) rzeroes;
    }

    module mkRegV#(dw, rw)();

    Vector#(TAdd#(TDiv#(dw, rw), 1), Bit#(rw)) v_regs <- replicateM(mkReg(0));
    ReservedZero#(TSub#(dw, TMul#(TDiv#(dw, rw), rw))


    endmodule: mkRegV

endpackage: RegV