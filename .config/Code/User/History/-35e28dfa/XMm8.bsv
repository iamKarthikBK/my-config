interface Ifc_kishan;
    method Action ma_start (Bit#(32) opcode);
    method ActionValue#(Bit#(32)) mav_result();
    method Bit#(32) mv_result ();
endinterface: Ifc_kishan

typedef enum {IDLE, A, B, C, END} KishanState deriving (Bits, Eq);

module mk_kishan (Ifc_kishan);

    Reg#(Bit#(KishanState)) rg_kishan <- mkReg(IDLE);

    method Action ma_start (Bit#(32)) if (rg_kishan == IDLE);
    rg_kishan <= A;
    endmethod

    rule rl_A if (rg_kishan == A && || !zx);
    let ans <- fn_kishan();
    rg_kishan <= B;

    endrule

    method ActionValue#(Bit#(32)) mav_result () if (rg_kishan == END);
        rg_kishan <= IDLE;
        return rg_value;
    endmethod: mav_result
endmodule: mk_kishan