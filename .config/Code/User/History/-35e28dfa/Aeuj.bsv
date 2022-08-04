interface Ifc_kishan;
    method Bit#(32) mv_result(Bit#(32) op1);
endinterface: Ifc_kishan

module mk_kishan (Ifc_kishan);

    method Bit#(32) mv_result (Bit#(32) op1);
        return op1 ^ 2;
    endmethod: mv_result
endmodule: mk_kishan