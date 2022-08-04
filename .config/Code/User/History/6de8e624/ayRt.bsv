package exponent;

    import multiplier :: * ;
    import ConfigReg :: * ;

    /*doc:interface: provides the interface for montgomery modular exponentiation*/
    interface Ifc_exponent#(numeric type key_width, numeric type data_width);
        
        /*doc:method: invokes the exponentiation*/
        method Action ma_start ();

        /*doc:method: returns the result of exponentiation*/
        method Bit#(key_width) mv_result ();
    endinterface: Ifc_exponent

    /*doc:enum: defines the states of exponentiation FSM*/
    typedef enum {IDLE, FEXL, FMNT, CPT1, CPT2, CPT3, CPT4, CPT5, CPT6, DONE} ExponentState deriving (Bits, Eq);

    /*doc:struct: defines the structure of input for exponent module*/
    typedef struct {
        Bit#(key_width) data_A,
        Bit#(key_width) data_EXP,
        Bit#(key_width) data_N,
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

        /*doc:reg: holds the counter variable*/
        Reg#(Bit#(TAdd#(TLog#(key_width), 1))) rg_counter <- mkConfigReg(0);

        /*doc:reg: input reg to multiplier module*/
        Reg#(MultiplierInput#(key_width, data_width)) rg_mul_inp <- mkReg(unpack(0));

        /*doc:reg: holds the length of exponent*/
        Reg#(Int#(TAdd#(TLog#(key_width), 1))) rg_exp_len <- mkConfigReg(0);

        /*doc:reg: holds the (internal) wait status for multi-cycle ops*/
        Reg#(Bool) rg_wait <- mkConfigReg(False);

        Ifc_multiplier#(key_width, data_width) multiplier <- mk_multiplier(rg_mul_inp);

        /*doc:rule: finds the length of exponent*/
        rule rl_find_exp_len if (rg_state == FEXL);
            if (rg_result != 0) begin
                rg_exp_len <- rg_exp_len + 1;
                rg_result <= rg_result >> 1;
            end
            else
                rg_state <= FMNT;
        endrule: rl_find_exp_len

        /*doc:rule: transform data_A to the montgomery domain*/
        rule rl_trans_mont if (rg_state == FMNT);
            rg_mul_inp <= MultiplierInput{data_A: command.data_A, data_B: command.data_R2N, data_M: command.data_N};
            multiplier.ma_start();
            rg_counter <= rg_counter + 1;
            rg_state <= CPT1;
        endrule: rl_trans_mont

        /*doc:rule: recieves the result of transformation*/
        rule rl_trans_mont_recv if ()

        /*doc:method: invokes the exponentiation*/
        method Action ma_start () if (rg_state == IDLE);
            rg_result <= command.data_B;
            rg_counter <= 0;
            rg_exp_len <= -1;
            rg_state <= FEXL;
        endmethod: ma_start

        /*doc:method: returns the result of exponentiation*/
        method Bit#(key_width) mv_result () if (rg_state == DONE);
            return rg_result;
        endmethod: mv_result
    endmodule: mk_exponent

endpackage: exponent