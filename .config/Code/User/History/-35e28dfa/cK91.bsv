interface Ifc_kishan;
    method Bit#(32) mv_result(Bit#(32));
endinterface: Ifc_kishan

module mk_kishan (Ifc_kishan);

    method Bit#(32) mv_result ();
        
        return rg_value;
    endmethod: mav_result
endmodule: mk_kishan