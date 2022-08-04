package field_ops;

    `include "acce;.defines"
    import primitives :: * ;
    import UniqueWrappers :: * ;

    interface Ifc_squarer;
        method ActionValue#(Bit#(`KeySize)) mav_square (Bit#(`KeySize) a);
    endinterface: Ifc_squarer

    (* synthesize *)
    module mk_squarer (Ifc_squarer);
        Wrapper#(Bit#(`KeySize), Bit#(`KeySize)) sq <- mkUniqueWrapper(fn_square);
        method ActionValue#(Bit#(`KeySize)) mav_square (Bit#(`KeySize) a);
            let ans <- sq.func(a);
            return ans;
        endmethod: mav_square
    endmodule: mk_squarer

    interface Ifc_add;
        method ActionValue#(Bit#(`KeySize)) mav_add (Bit#(`KeySize) a, Bit#(`KeySize) b);
    endinterface: Ifc_add

    (* synthesize *)
    module mk_add (Ifc_add);
        Wrapper2#(Bit#(`KeySize), Bit#(`KeySize), Bit#(`KeySize)) add <- mkUniqueWrapper2(fn_add);
        method ActionValue#(Bit#(`KeySize)) mav_add (Bit#(`KeySize) a, Bit#(`KeySize) b);
            let ans <- add.func(a, b);
            return ans;
        endmethod: mav_add
    endmodule: mk_add

endpackage: field_ops