package adder;

    /*doc:interface: provides the interface for a single cycle BigNum adder*/
    interface Ifc_adder#(numeric type key_width);
        method Bit#(TAdd#(key_width, 1)) mv_add (Bit#(key_width) op_1, Bit#(key_width) op_2, Bit#(1) op_carry_in);
    endinterface: Ifc_adder

endpackage: adder