package adder;

    /*doc:interface: provides the interface for a single cycle BigNum adder*/
    interface Ifc_adder#(numeric type key_width);

        /*doc:method: returns the sum*/
        method Bit#(TAdd#(key_width, 1)) mv_add (Bit#(key_width) op_1, Bit#(key_width) op_2, Bit#(1) op_carry_in);
    endinterface: Ifc_adder

    /*doc:module: implements the big num adder*/
    module mk_adder(Ifc_adder#(key_width));

        /*doc:method: returns the sum*/
        method Bit#(TAdd#(key_width, 1)) mv_add (Bit#(key_width) op_1, Bit#(key_width) op_2, Bit#(1) op_carry_in);
        {
            return (zeroExtend(op_1) + zeroExtend(op_2) + zeroExtend(op_carry_in));
        }

endpackage: adder