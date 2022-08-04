package RegV;

    import Vector :: * ;

    typedef struct {
        ReservedZero#(TSub#(TMul#(TAdd#(TDiv#(dw, rw), 1), rw), dw)) rzeroes;
    } LargeReg deriving (Bits, Eq);

    module mkRegV#(dw, rw)();

    Vector#(TDiv#(dw, rw), Bit#(rw)) v_regs <- replicateM(mkReg(0));
    Reg#(Bit#(TSub#(dw, TMul#(TDiv#(dw, rw), rw)), rw)) rg_top <- mkReg(0);

    method Bit#(dw) _read_full ();
        return {rg_top, pack(readVReg(v_regs))};
    endmethod: _read_full

    method Action _write_full (Bit#(dw) data);
        rg_top <= data[dw:TSub#(dw, TMul#(TDiv#(dw, rw), rw))];
        writeVReg(v_regs, unpack(data));
    endmethod: _write_full

    endmodule: mkRegV

endpackage: RegV