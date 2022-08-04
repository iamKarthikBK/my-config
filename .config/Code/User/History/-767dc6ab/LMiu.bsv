package field_ops;

    `include "acce;.defines"
    import primitives :: * ;
    import UniqueWrappers :: * ;

    interface Ifc_squarer;
        method ActionValue#(Bit#(`KeySize)) mav_square (Bit#(`KeySize) a);
    endinterface: Ifc_squarer

    module mk_squarer (Ifc_squarer);
        Wrapper#(Bit#(`KeySize), Bit#(`KeySize)) sq <- mkUniqueWrapper(fn_square);
        method ActionValue#(Bit#(`KeySize)) mav_square (Bit#(`KeySize) a);
    endmodule: mk_squarer

endpackage: field_ops