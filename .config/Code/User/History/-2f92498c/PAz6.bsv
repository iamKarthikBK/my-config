package field_ops;

    `include "ecc_accel_params.defines"
    import kmul :: * ;
    import Vector :: * ;
    import ConfigReg :: * ;
    import DReg :: * ;

    typedef enum {SINGLE_CYCLE, MULTI_CYCLE} WaitingForType deriving (Bits, Eq, FShow);

    /*doc:interface: interface to communicate with the inversion module */
    interface Ifc_inverse;

        method Action                       ma_start    (Bit#(`KeySize) input_op);
        method ActionValue#(Bit#(`KeySize)) mav_result  ();

    endinterface: Ifc_inverse

    /*doc:function: inserts zeroes in the input value's binary representation*/
    function Bit#(`DoubleKeySize) fn_insert_zeroes (Bit#(`KeySize) input_value);

        Bit#(`DoubleKeySize) lv_store = 0;

        for (int lv_counter_1 = 0, int lv_counter_2 = 0;
                lv_counter_1 < fromInteger(valueOf(`KeySize));
                lv_counter_1 = lv_counter_1 + 1, lv_counter_2 = lv_counter_2 + 2)
        begin
            lv_store[lv_counter_2] = input_value[lv_counter_1];
        end

        return(lv_store);

    endfunction: fn_insert_zeroes

    function Bit#(`KeySize) fn_square (Bit#(`KeySize) to_square);

        return (fn_mod(fn_insert_zeroes(to_square)));

    endfunction: fn_square

    function Bit#(`KeySize) fn_mod(Bit#(`DoubleKeySize) to_reduce);
    
        Bit#(`KeySize) lv_upper_half = {1'd0, to_reduce[`t_A * 2 - 2 : `t_A]};
        Bit#(`KeySize) lv_lower_half = to_reduce[`t_A - 1 : 0];
        Vector#(6, Bit#(`KeySize)) v_result;
        v_result[0] = lv_upper_half[`t_A - `t_D - 1 : 0] << `t_D;
        v_result[1] = lv_upper_half[`t_A - `t_C - 1 : 0] << `t_C;
        v_result[2] = lv_upper_half[`t_A - `t_B - 1 : 0] << `t_B;
        v_result[3] = lv_upper_half[`t_A -1 : `t_A - `t_D] << `t_D;
        v_result[4] = lv_upper_half[`t_A -1 : `t_A - `t_C] << `t_C;
        v_result[5] = lv_upper_half[`t_A -1 : `t_A - `t_B] << `t_B;
        return(lv_lower_half ^ lv_upper_half ^ v_result[0] ^ v_result[1] ^ v_result[2] ^ v_result[3] ^ v_result[4] ^ v_result[5]);
    
    endfunction: fn_mod

    // TODO: remove verilog for ks* from utils/

    function Bit#(`KeySize) fn_multiply (Bit#(`KeySize) op1, Bit#(`KeySize) op2);

        return (fn_mod(fn_kmul(op1, op2)));

    endfunction: fn_multiply

    /*doc:note: States of the Inversion HW */
    typedef enum {INPUTS_READY, BRAUER, OUTPUTS_READY, IDLE} InversionState deriving (Bits, Eq);

    /*doc:note: States of the BRAUER HW using Optimal (Brauer) Addition Chains */
    typedef enum {`BrauerChain, DONE} BrauerPosition deriving (Bits, Eq);

    /*doc:function: return the previous partial product's position for current exponentiation*/
    function BrauerPosition fn_prev_brauer_pos(BrauerPosition current_pos);

        case(current_pos)

            B2: return B1;
            B4: return B2;
            B8: return B4;
            B16: return B8;
            B32: return B16;
            B64: return B32;
            B128: return B64;
            B256: return B128;
            B272: return B16;
            B280: return B8;
            B282: return B2;

        endcase

    endfunction: fn_prev_brauer_pos

    /*doc:function: return the next brauer position for change of state*/
    function BrauerPosition fn_next_brauer_pos(BrauerPosition current_pos);

        case(current_pos)

            B2: return B4;
            B4: return B8;
            B8: return B16;
            B16: return B32;
            B32: return B64;
            B64: return B128;
            B128: return B256;
            B256: return B272;
            B272: return B280;
            B280: return B282;
            B282: return DONE;

        endcase

    endfunction: fn_next_brauer_pos

    /*doc:module: This module implements the hardware for finding a multiplicative inversion
    using the itoh-tsuji algorithm. Essentially, we compute $a^{-1} = (a^{2^{m-1}-1})^2$
    by resuing the karatsuba multiplier in mk_multiplier and squarer in mk_squaring modules.
    
    The Inversion curcuit is implements as a Moore FSM with 4 states:
    0- INPUTS_READY     - Start the Brauer FSM and tranition the state to BRAUER
    1- BRAUER   - Wait for the Brauer FSM to reach 'DONE' state
    2- OUTPUTS_READY    - Load the outputs into the register rg_result and return the output
    3- IDLE             - Do nothing
    
    The Brauer machine is implemented as a Moore FSM with `BrauerLength + 1 states
    Each of the states in the `BrauerChain are responsible to fincing the next partial product
    The 'DONE' state of the FSM indicates that the result is ready. The output is loaded to a 
    register rg_result and the state is transitioned into OUTPUTS_READY
    
    The Brauer Machine has 3 rules:
    - rl_brauer_start   -> load the input operand into vector v_products[0]
    - rl_brauer_multiply-> Based on the current state, perform the correct multiplication and
        transition the state of the Brauer machine into the next state for computing the next
        product according to the addition chain.
    - rl_brauer_end     -> Store the result of the inversion into */
    (* synthesize *)
    module mk_inverse (Ifc_inverse);

        Reg#(Bit#(`KeySize))                          rg_op1                <- mkReg(0);
        Reg#(Bit#(`KeySize))                          rg_result             <- mkReg(0);
        Reg#(BrauerPosition)                          rg_brauer_position    <- mkConfigReg(B1);
        Reg#(InversionState)                          rg_state              <- mkConfigReg(IDLE);
        Vector#(`BrauerLength, Reg#(Bit#(`KeySize)))  v_products            <- replicateM(mkReg(1));
        Vector#(`BrauerLength, Reg#(Bit#(`KeySize)))  v_temp                <- replicateM(mkReg(1));
        Vector#(`BrauerLength, Reg#(Bit#(4)))         v_count               <- replicateM(mkReg(0));

        // (* descending_urgency = "rl_brauer_multiply_exp, rl_brauer_multiply_mul" *)
        // (* preempts = "rl_brauer_multiply_exp, rl_brauer_multiply_mul" *)

        /*doc:rule: starts the brauer FSM and changes the state into BRAUER*/
        rule rl_brauer_start if (rg_state == INPUTS_READY);
            v_products[pack(rg_brauer_position)]    <= fn_multiply(v_temp[pack(B1)], fn_square(rg_op1));
            v_count[pack(B1)]                       <= v_count[pack(B1)] + 1;
            rg_brauer_position                      <= B2;
            rg_state                                <= BRAUER;
        endrule: rl_brauer_start

        /*doc:computes partial products of the Brauer FSM*/
        rule rl_brauer_multiply_exp if (rg_state == BRAUER && v_count[pack(rg_brauer_position)] < pack(rg_brauer_position));
            v_temp[pack(rg_brauer_position)]        <= fn_square(v_temp[pack(rg_brauer_position)]);
            v_count[pack(rg_brauer_position)]       <= v_count[pack(rg_brauer_position)] + 1;
        endrule: rl_brauer_multiply_exp

        rule rl_brauer_multiply_mul if (rg_state == BRAUER && v_count[pack(rg_brauer_position)] >= pack(rg_brauer_position));
            v_products[pack(rg_brauer_position)] <= fn_multiply(v_temp[pack(B2)], v_products[pack(fn_prev_brauer_pos(rg_brauer_position))]);
            rg_brauer_position                      <= fn_next_brauer_pos(rg_brauer_position);
        endrule: rl_brauer_multiply_mul

        /*doc:rule: load the result of Brauer exponentiation into a register rg_result
        and transition the state into OUTPUTS_READY*/
        rule rl_brauer_end if (rg_state == BRAUER && rg_brauer_position == DONE);
            rg_result <= fn_square(v_products[`BrauerLength - 1]);
            rg_state  <= OUTPUTS_READY;
        endrule: rl_brauer_end

        /*doc:method: loads the input operand into register rg_op1 and
        changes the state to INPUTS_READY*/
        method Action ma_start(input_op) if (rg_state == IDLE);

            rg_op1      <= input_op;
            rg_state    <= INPUTS_READY;

        endmethod: ma_start

        /*doc:method: changes the state of the inversion FSM into IDLE and returns the value stored
        in reguster rg_result*/
        method ActionValue#(Bit#(`KeySize)) mav_result if (rg_state == OUTPUTS_READY);

            rg_state <= IDLE;
            return(rg_result);

        endmethod: mav_result

    endmodule: mk_inverse

    function Bit#(`KeySize) fn_addsub (Bit#(`KeySize) op1, Bit#(`KeySize) op2);

        return (op1 ^ op2);

    endfunction: fn_addsub

endpackage: field_ops
