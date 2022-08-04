package multiplier;

    import ConfigReg :: * ;
    import Vector :: * ;
    import adder :: * ;
    import DReg :: * ;

    /*doc:interface provides the interface to perform montgomery multiplication*/
    interface Ifc_multiplier#(numeric type key_width, numeric type data_width);

        /*doc:method: invokes multiplication for a * b mod m*/
        method Action ma_start ();

        /*doc:method: obtains the multiplication result and changes state to IDLE*/
        method ActionValue#(Bit#(key_width)) mav_result ();

        /*doc:method: perform noAction*/
        method Action ma_wait ();
    endinterface: Ifc_multiplier

    /*doc:enum: defines the states for multiplier FSM*/
    typedef enum {IDLE, CALQ, IADD, MOVE, FCHK, DONE} MultiplierState deriving (Bits, Eq);

    /*doc:struct: defines the multiplier input structure*/
    typedef struct {
        Bit#(key_width) data_A;
        Bit#(key_width) data_B;
        Bit#(key_width) data_M;
    } MultiplierInput#(numeric type key_width) deriving (Bits, Eq, FShow);

    /*doc:module: implements the montgomery multiplication algorithm*/
    module mk_multiplier#(Reg#(MultiplierInput#(key_width)) command)(Ifc_multiplier#(key_width, data_width)) provisos (
        Add#(a__, TLog#(key_width), key_width),
        Add#(b__, TLog#(TAdd#(1, key_width)), TAdd#(TLog#(key_width), 1)),
        Mul#(c__, data_width, TAdd#(key_width, data_width)),
        Mul#(n_chunks, data_width, key_width)
    );

    Ifc_adder#(data_width) adder <- mk_adder;

    /*doc:reg: holds the bit position to be operated on*/
    Reg#(Bit#(TAdd#(TLog#(key_width), 1))) rg_position <- mkConfigReg(0);

    /*doc:reg: holds a 16-bit counter*/
    Reg#(Bit#(16)) rg_counter <- mkConfigReg(0);

    /*doc:vector: holds the multiplication result*/
    Reg#(Bit#(TAdd#(key_width, 1))) rg_result <- mkConfigReg(0);

    /*doc:vector: holds the data_width size chunks of resulting output*/
    Vector#(n_chunks, Reg#(Bit#(data_width))) v_rg_outp_chunks <- replicateM(mkReg(0));

    /*doc:reg: holds the state of the multplier FSM*/
    Reg#(MultiplierState) rg_state <- mkConfigReg(IDLE);

    /*doc:reg: holds the Q bit*/
    Reg#(Bit#(1)) rg_Q <- mkConfigReg(0);

    /*doc:reg: holds the carry bit*/
    Reg#(Bit#(1)) rg_carry <- mkConfigReg(0);

    /*doc:reg: holds the carry overflow bit*/
    Reg#(Bit#(1)) rg_carry_oflw <- mkConfigReg(0);

    /*doc:reg: holds the cycle delay status for methods to perform actions in the next cycle*/
    Reg#(Bool) rg_cycle_delay <- mkDReg(False);

    /*doc:rule: computes the partial result Q*/
    rule rl_compute_q if (rg_state == CALQ);
        if (command.data_A[rg_position] != 0)
            rg_Q <= rg_result[0] + command.data_B[0];
            $display("debug: wrote Q bit %b", rg_result[0] + command.data_B[0]);
        else
            rg_Q <= rg_result[0];
            $display("debug: wrote Q bit %b", rg_result[0]);
        rg_state <= IADD;
    endrule: rl_compute_q

    /*doc:rule: perform additions if cmd bit is high and q bit is low*/
    rule rl_add_ch_ql if (rg_state == IADD && command.data_A[rg_position] == 1 && rg_Q == 0);
        if (rg_counter < (fromInteger(valueOf(key_width) / fromInteger(valueOf(data_width))))) begin
            let lv_st_pos = fromInteger(valueOf(data_width)) * rg_counter + fromInteger(valueOf(data_width)) - 1;
            let lv_end_pos = fromInteger(valueOf(data_width)) * rg_counter;
            let lv_add_res = adder.mv_add(rg_result[lv_st_pos:lv_end_pos], command.data_B[lv_st_pos:lv_end_pos], rg_carry);
            v_rg_outp_chunks[rg_counter] <= lv_add_res[fromInteger(valueOf(data_width)) - 1 : 0];
            rg_carry <= lv_add_res[fromInteger(valueOf(data_width))];
            rg_counter <= rg_counter + 1;
        end
        else
        begin
            if (rg_position == fromInteger(valueOf(key_width) - 1))
                rg_state <= FCHK;
            else
                rg_state <= CALQ;
            rg_counter <= 0;
            rg_carry <= 0;
            rg_position <= rg_position + 1;
            let lv_S = ({rg_carry + rg_result[valueOf(key_width)], pack(readVReg(v_rg_outp_chunks))}) >> 1;
            lv_S[fromInteger(fromInteger(valueOf(data_width)))] = rg_carry & rg_result[fromInteger(fromInteger(valueOf(data_width)))];
            rg_result <= lv_S;
        end
    endrule: rl_add_ch_ql

    /*doc:rule: performs additions if cmd bit is low and q bit is low*/
    rule rl_add_cl_ql if (rg_state == IADD && command.data_A[rg_position] == 0 && rg_Q == 0);
        rg_result <= rg_result >> 1;
        rg_position <= rg_position + 1;
        if (rg_position == fromInteger(valueOf(key_width) - 1))
            rg_state <= FCHK;
        else
            rg_state <= CALQ;
    endrule: rl_add_cl_ql

    /*doc:rule: performs additions if cmd bit is low and q bit is high*/
    rule rl_add_cl_qh if (rg_state == IADD && command.data_A[rg_position] == 0 && rg_Q == 1);
        if (rg_counter < (fromInteger(valueOf(key_width) / fromInteger(valueOf(data_width))))) begin
            let lv_st_pos = fromInteger(valueOf(data_width)) * rg_counter + fromInteger(valueOf(data_width)) - 1;
            let lv_end_pos = fromInteger(valueOf(data_width)) * rg_counter;
            let lv_add_res = adder.mv_add(rg_result[lv_st_pos:lv_end_pos], command.data_M[lv_st_pos:lv_end_pos], rg_carry);
            v_rg_outp_chunks[rg_counter] <= lv_add_res[fromInteger(valueOf(data_width)) - 1 : 0];
            rg_carry <= lv_add_res[fromInteger(valueOf(data_width))];
            rg_counter <= rg_counter + 1;
        end
        else begin
            if (rg_position == fromInteger(valueOf(key_width) - 1))
                rg_state <= FCHK;
            else
                rg_state <= CALQ;
            rg_counter <= 0;
            rg_carry <= 0;
            rg_position <= rg_position + 1;
            let lv_S = ({rg_carry + rg_result[valueOf(key_width)], pack(readVReg(v_rg_outp_chunks))}) >> 1;
            lv_S[fromInteger(fromInteger(valueOf(data_width)))] = rg_carry & rg_result[fromInteger(fromInteger(valueOf(data_width)))];
            rg_result <= lv_S;
        end
    endrule: rl_add_cl_qh

    /*doc:rule: performs additions if cmd bit is high and q bit is low*/
    rule rl_add_ch_qh if (rg_state == IADD && command.data_A[rg_position] == 1 && rg_Q == 1);
        if (rg_counter < (fromInteger(valueOf(key_width) / fromInteger(valueOf(data_width))))) begin
            let lv_st_pos = fromInteger(valueOf(data_width)) * rg_counter + fromInteger(valueOf(data_width)) - 1;
            let lv_end_pos = fromInteger(valueOf(data_width)) * rg_counter;
            let lv_add_res = adder.mv_add(rg_result[lv_st_pos:lv_end_pos], command.data_M[lv_st_pos:lv_end_pos], rg_carry);
            v_rg_outp_chunks[rg_counter] <= lv_add_res[fromInteger(valueOf(data_width)) - 1 : 0];
            rg_carry <= lv_add_res[fromInteger(valueOf(data_width))];
            rg_counter <= rg_counter + 1;
        end
        else begin
            rg_state <= MOVE;
            rg_counter <= 0;
            rg_carry_oflw <= rg_carry & rg_result[fromInteger(fromInteger(valueOf(data_width)))];
            rg_result <= ({rg_carry + rg_result[valueOf(key_width)], pack(readVReg(v_rg_outp_chunks))});
            rg_carry <= 0;
        end
    endrule: rl_add_ch_qh

    /*doc:rule: MOVE and perform the nect addition*/
    rule rl_add_next if (rg_state == MOVE);
        if (rg_counter < (fromInteger(valueOf(key_width) / fromInteger(valueOf(data_width))))) begin
            let lv_st_pos = fromInteger(valueOf(data_width)) * rg_counter + fromInteger(valueOf(data_width)) - 1;
            let lv_end_pos = fromInteger(valueOf(data_width)) * rg_counter;
            let lv_add_res = adder.mv_add(rg_result[lv_st_pos:lv_end_pos], command.data_M[lv_st_pos:lv_end_pos], rg_carry);
            v_rg_outp_chunks[rg_counter] <= lv_add_res[fromInteger(valueOf(data_width)) - 1 : 0];
            rg_carry <= lv_add_res[fromInteger(valueOf(data_width))];
            rg_counter <= rg_counter + 1;
        end
        else begin
            if (rg_position == fromInteger(valueOf(key_width) - 1))
                rg_state <= FCHK;
            else
                rg_state <= CALQ;
            rg_counter <= 0;
            rg_carry <= 0;
            rg_position <= rg_position + 1;
            let lv_S = ({rg_carry + rg_result[valueOf(key_width)], pack(readVReg(v_rg_outp_chunks))}) >> 1;
            lv_S[fromInteger(fromInteger(valueOf(data_width)))] = rg_carry_oflw | (rg_carry & rg_result[fromInteger(fromInteger(valueOf(data_width)))]);
            rg_result <= lv_S;
        end
    endrule: rl_add_next

    /*doc:rule: perform final checks*/
    rule rl_fchk if (rg_state == FCHK);
        rg_position <= 0;
        if (rg_result >- zeroExtend(command.data_M)) begin
            if (rg_counter < (fromInteger(valueOf(key_width) / fromInteger(valueOf(data_width))))) begin
                let lv_st_pos = fromInteger(valueOf(data_width)) * rg_counter + fromInteger(valueOf(data_width)) - 1;
                let lv_end_pos = fromInteger(valueOf(data_width)) * rg_counter;
                let lv_add_res = adder.mv_add(rg_result[lv_st_pos:lv_end_pos], (~(command.data_M) | 1)[lv_st_pos:lv_end_pos], rg_carry);
                rg_result <= lv_add_res[fromInteger(valueOf(data_width)) - 1 : 0];
                rg_carry <= lv_add_res[fromInteger(valueOf(data_width))];
                rg_counter <= rg_counter + 1;
            end
            else begin
                rg_state <= DONE;
                rg_counter <= 0;
                rg_carry <= 0;
                rg_result <= ({rg_carry + rg_result[valueOf(key_width)], pack(readVReg(v_rg_outp_chunks))});
            end
        end
        else
            rg_state <= DONE;
    endrule: rl_fchk

    /*doc:rule: actions of method ma_start*/
    rule rl_start if (rg_state == IDLE && rg_cycle_delay == True);
        rg_state <= CALQ;
        rg_counter <= 0;
        rg_result <= 0;
    endrule: rl_start

    /*doc:method: invokes multiplication for a * b mod m*/
    method Action ma_start () if (rg_state == IDLE);
        rg_cycle_delay <= True;
    endmethod: ma_start

    /*doc:method: perform noAction*/
    method Action ma_wait () if (rg_state == IDLE || rg_state == DONE);
        noAction;
    endmethod: ma_wait

    /*doc:method: obtains the multiplication result and changes state to IDLE*/
    method ActionValue#(Bit#(key_width)) mav_result () if (rg_state == DONE);
        rg_state <= IDLE;
        return truncate(rg_result);
    endmethod: mav_result

    endmodule: mk_multiplier

endpackage: multiplier