package adder;

    /*doc:interface: provides the interface for a single cycle BigNum adder*/
    interface Ifc_adder#(numeric type width);

        /*doc:method: returns the sum*/
        method Bit#(TAdd#(width, 1)) mv_add (Bit#(width) op_1, Bit#(width) op_2, Bit#(1) op_carry_in);
    endinterface: Ifc_adder

    /*doc:module: implements the big num adder*/
    module mk_adder(Ifc_adder#(width));

        /*doc:method: returns the sum*/
        method Bit#(TAdd#(width, 1)) mv_add (Bit#(width) op_1, Bit#(width) op_2, Bit#(1) op_carry_in);
            return (zeroExtend(op_1) + zeroExtend(op_2) + zeroExtend(op_carry_in));
        endmethod: mv_add

    endmodule: mk_adder

endpackage: adder