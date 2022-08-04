package exponent;

    import multiplier :: * ;
    import ConfigReg :: * ;

    /*doc:interface: provides the interface for montgomery modular exponentiation*/
    interface Ifc_exponent#(numeric type key_width, numeric type data_width);
        
        /*doc:method: invokes the exponentiation*/
        method Action ma_start ();

        /*doc:method: returns the result of exponentiation*/
        method ActionValue#(Bit#(key_width)) mav_result ();

        /*doc:method: returns True if IDLE*/
        method Bool mv_idle ();
        
        /*doc:method: returns True if DONE*/
        method Bool mv_outp_ready ();
    endinterface: Ifc_exponent

    /*doc:enum: defines the states of exponentiation FSM*/
    typedef enum {IDLE, FEXL, FMNT, CPT1, CPT2, CPT3, CPT4, CPT5, CPT6, CPT7, CPT8, DONE} ExponentState deriving (Bits, Eq);

    /*doc:struct: defines the structure of input for exponent module*/
    typedef struct {
        Bit#(key_width) data_A;
        Bit#(key_width) data_EXP;
        Bit#(key_width) data_N;
        Bit#(key_width) data_R2N;
    } ExponentInput#(numeric type key_width) deriving (Bits, Eq, FShow);

    /*doc:module: implements montgomery modular exponentiation a ^ b mod m*/
    module mk_exponent#(Reg#(ExponentInput#(key_width)) command)(Ifc_exponent#(key_width, data_width)) provisos (
        Add#(a__, TLog#(key_width), key_width),
        Add#(b__, TLog#(TAdd#(1, key_width)), TAdd#(TLog#(key_width), 1)),
        Add#(c__, key_width, TMul#(2, key_width)),
        Mul#(d__, data_width, TAdd#(key_width, data_width)),
        Mul#(e__, data_width, key_width),
        Bits#(Integer, 16)
    );

        /*doc:reg: holds the result of exponentiation*/
        Reg#(Bit#(key_width)) rg_result <- mkReg(0);

        /*doc:reg: holds a value in montgomery domain*/
        Reg#(Bit#(key_width)) rg_mont <- mkReg(0);

        /*doc:reg: holds the state of exponentiation FSM*/
        Reg#(ExponentState) rg_state <- mkConfigReg(IDLE);

        /*doc:reg: input reg to multiplier module*/
        Reg#(MultiplierInput#(key_width)) rg_mul_inp <- mkReg(unpack(0));

        /*doc:reg: holds the length of exponent*/
        Reg#(Int#(TAdd#(TLog#(key_width), 1))) rg_position <- mkConfigReg(0);

        /*doc:reg: holds the (internal) wait status for multi-cycle ops*/
        Reg#(Bool) rg_wait <- mkConfigReg(False);

        Ifc_multiplier#(key_width, data_width) multiplier <- mk_multiplier(rg_mul_inp);

        /*doc:rule: finds the length of exponent*/
        rule rl_find_exp_len if (rg_state == FEXL);
            if (rg_result != 0) begin
                rg_position <= rg_position + 1;
                rg_result <= rg_result >> 1;
            end
            else
                rg_state <= FMNT;
        endrule: rl_find_exp_len

        /*doc:rule: transform data_A to the montgomery domain*/
        rule rl_trans_mont if (rg_state == FMNT && rg_wait == False);
            rg_mul_inp <= MultiplierInput{data_A: command.data_A, data_B: command.data_R2N, data_M: command.data_N};
            multiplier.ma_start();
            rg_wait <= True;
            rg_state <= CPT1;
        endrule: rl_trans_mont

        /*doc:rule: recieves the result of transformation*/
        rule rl_trans_mont_recv if (rg_state == FMNT && rg_wait == True);
            multiplier.ma_wait();
            let lv_mul_res <- multiplier.mav_result();
            rg_mont <= lv_mul_res;
            rg_result <= lv_mul_res;
            rg_wait <= False;
            rg_state <= CPT2;
        endrule: rl_trans_mont_recv

        /*doc:rule: decrements the exp_len register*/
        rule rl_decrement if (rg_state == CPT2 && rg_position >= 0 && rg_wait == False);
            rg_position <= rg_position - 1;
            rg_state <= CPT3;
        endrule: rl_decrement

        /*doc:rule: perform single square operation*/
        rule rl_single_square if (rg_state == CPT3 && rg_position >= 0 && rg_wait == False);
            rg_mul_inp <= MultiplierInput{data_A: rg_result, data_B: rg_result, data_M: command.data_N};
            multiplier.ma_start();
            rg_wait <= True;
            rg_state <= CPT4;
        endrule: rl_single_square

        /*doc:rule: recieve the result of squaring operation*/
        rule rl_single_square_recv if (rg_state == CPT4 && rg_position >= 0 && rg_wait == True);
            multiplier.ma_wait();
            let lv_mul_res <- multiplier.mav_result();
            rg_result <= lv_mul_res;
            rg_wait <= False;
            if (command.data_EXP[rg_position] == 1)
                rg_state <= CPT5;
            else
                rg_state <= CPT2;
        endrule: rl_single_square_recv

        /*doc:rule: perform single multiplication when n is odd*/
        rule rl_single_mult_odd if (rg_state == CPT5 && rg_position >= 0 && rg_wait == False);
            rg_mul_inp <= MultiplierInput{data_A: rg_result, data_B: rg_mont, data_M: command.data_N};
            multiplier.ma_start();
            rg_wait <= True;
            rg_state <= CPT6;
        endrule: rl_single_mult_odd

        /*doc:rule: recieve the result of single multiplication*/
        rule rl_single_mult_odd_recv if (rg_state == CPT6 && rg_position >= 0 && rg_wait == True);
            multiplier.ma_wait();
            let lv_mul_res <- multiplier.mav_result();
            rg_result <= lv_mul_res;
            rg_wait <= False;
            rg_state <= CPT2;
        endrule: rl_single_mult_odd_recv

        /*doc:rule: perform single multiplication when n is even*/
        rule rl_single_mult_even if ((rg_state == CPT2 || rg_state == CPT3 || rg_state == CPT4) && rg_position == -1 && rg_wait == False);
            rg_mul_inp <= MultiplierInput{data_A: rg_result, data_B: 1, data_M: command.data_N};
            multiplier.ma_start();
            rg_wait <= True;
            rg_state <= CPT7;
        endrule: rl_single_mult_even

        /*doc:rule: recieve the result of single multiplication*/
        rule rl_single_mult_even_recv if (rg_state == CPT7 && rg_position < 0 && rg_wait == True);
            multiplier.ma_wait();
            let lv_mul_res <- multiplier.mav_result();
            rg_result <= lv_mul_res;
            rg_wait <= False;
            rg_state <= DONE;
        endrule: rl_single_mult_even_recv

        /*doc:method: invokes the exponentiation*/
        method Action ma_start () if (rg_state == IDLE);
            rg_result <= command.data_EXP;
            rg_position <= -1;
            rg_wait <= False;
            rg_state <= FEXL;
        endmethod: ma_start

        /*doc:method: returns True if the block is IDLE*/
        method Bool mv_idle ();
            return (rg_state == IDLE) ? True : False;
        endmethod: mv_idle

        /*doc:method: returns True if the block is DONE*/
        method Bool mv_outp_ready ();
            return (rg_state == DONE) ? True : False;
        endmethod: mv_outp_ready

        /*doc:method: returns the result of exponentiation*/
        method ActionValue#(Bit#(key_width)) mav_result () if (rg_state == DONE);
            rg_state <= IDLE;
            return rg_result;
        endmethod: mav_result
    endmodule: mk_exponent

endpackage: exponent