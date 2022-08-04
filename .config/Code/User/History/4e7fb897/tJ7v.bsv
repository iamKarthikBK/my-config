package RegV;

    import Vector :: * ;

    typedef {
        ReservedZero#(TSub#(TMul#(TAdd#(TDiv#(dw, rw), 1), rw), dw)) rzeroes;
    }

    module mkRegV#(dw, rw)();

    Vector#(TDiv#(dw, rw), Bit#(rw)) v_regs <- replicateM(mkReg(0));
    Reg#(TSub#(dw, TMul#(TDiv#(dw, rw), rw)), rw) reg <- mkReg(0);
    ReservedZero#(TSub#(dw, TMul#(TDiv#(dw, rw), rw)))


    endmodule: mkRegV

endpackage: RegV