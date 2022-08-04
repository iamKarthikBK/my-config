package field_ops;

    `include "acce;.defines"
    import primitives :: * ;

    interface Ifc_squarer;
        method ActionValue#(Bit#(`KeySize)) mav_square (Bit#(`KeySize) a);
    endinterface: Ifc_squarer

endpackage: field_ops