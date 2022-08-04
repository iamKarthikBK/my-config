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
    } ExponentInput deriving (Bits, Eq, FShow);
    /*doc:module: implements montgomery modular exponentiation a ^ b mod m*/

endpackage: exponent