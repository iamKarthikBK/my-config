package exponent;

    import multiplier :: * ;

    /*doc:interface: provides the interface for montgomery modular exponentiation*/
    interface Ifc_exponent#(numeric type key_width, numeric type data_width);
        
        /*doc:method: invokes the exponentiation*/
        method Action ma_start ();

        /*doc:method: returns the result of exponentiation*/
        method Bit#(key_width) mv_result ();
    endinterface: Ifc_exponent

    /*doc:enum: defines the states of exponentiation FSM*/
    typedef enum {IDLE, FEXL, FMNT, IEXP, CPT1, CPT2, CPT3, CPT4, CPT5, CPT6, DONE} ExponentState deriving (Bits, Eq);

    /*doc:struct: defines the structure of input for exponent module*/
    typedef struct {
        Bit#(key_width) data_A,
        Bit#(key_width) data_B,
        Bit#(key_width) data_M,
        Bit#(key_width) data_R2N
    } ExponentInput#(numeric type key_width) deriving (Bits, Eq, FShow);

    /*doc:module: implements montgomery modular exponentiation a ^ b mod m*/
    module mk_exponent#(Reg#(ExponentInput#(key_width)) command)(Ifc_exponent#(key_width, data_width)) provisos (
        Add#(a__, TLog#(key_width), key_width),
        Add#(b__, TLog#(TAdd#(1, key_width)), TAdd#(TLog#(key_width), 1)),
        Add#(c__, key_width, TMul#(2, key_width)),
        Mul#(d__, data_width, TAdd#(key_width, data_width)),
        Mul#(e__, data_width, key_width)
    );

        /*doc:reg: holds the result of exponentiation*/
        Reg#(Bit#(key_width)) rg_result <- mkReg(0);

        /*doc:reg: holds the state of exponentiation FSM*/
        Reg#(ExponentState) rg_state <- mkConfigReg(IDLE);

        /*doc:method: invokes the exponentiation*/
        method Action ma_start () if (rg_state == IDLE);
            rg_counter <= 0;
            rg_state <= FEXL;
        endmethod: ma_start

        /*doc:method: returns the result of exponentiation*/
        method Bit#(key_width) mv_result () if (rg_state == DONE);
            return rg_result;
        endmethod: mv_result
    endmodule: mk_exponent

endpackage: exponent