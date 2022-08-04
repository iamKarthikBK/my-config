package field_ops;

    `include "acce;.defines"
    import primitives :: * ;
    import UniqueWrappers :: * ;

    interface Ifc_squarer;
        method ActionValue#(FFE) mav_square (FFE a);
    endinterface: Ifc_squarer

    (* synthesize *)
    module mk_squarer (Ifc_squarer);
        Wrapper#(FFE, FFE) sq <- mkUniqueWrapper(fn_square);
        method ActionValue#(FFE) mav_square (FFE a);
            let ans <- sq.func(a);
            return ans;
        endmethod: mav_square
    endmodule: mk_squarer

    interface Ifc_add;
        method ActionValue#(FFE) mav_add (FFE a, FFE b);
    endinterface: Ifc_add

    (* synthesize *)
    module mk_add (Ifc_add);
        Wrapper2#(FFE, FFE, FFE) add <- mkUniqueWrapper2(fn_add);
        method ActionValue#(FFE) mav_add (FFE a, FFE b);
            let ans <- add.func(a, b);
            return ans;
        endmethod: mav_add
    endmodule: mk_add

endpackage: field_ops