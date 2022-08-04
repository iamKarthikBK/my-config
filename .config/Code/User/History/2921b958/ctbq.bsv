package inverse;

    `include "accel.defines"
    import primitives       :: * ;
    import multiplier       :: * ;
    import StmtFSM          :: * ;
    import UniqueWrappers   :: * ;
    import Vector           :: * ;
    import ConfigReg        :: * ;

    /*doc:interface: defines the interface of inversion HW*/
    interface Ifc_inverse;
        method Action ma_start (FFE a);
        method ActionValue#(FFE) mav_result ();
        method Action ma_wait (); 
    endinterface: Ifc_inverse

    /*doc:enum: defines the enumeration for the states used in inverse HW*/
    typedef enum {IDLE, START, ITER, CHECK, WAIT, DONE} InverseState deriving (Bits, Eq);

    (* descending_urgency = "rl_sq_once, rl_inv_check, rl_count" *)
    (* descending_urgency = "rl_mul, rl_reset_count" *)
    (* mutually_exclusive = "rl_sq_once, rl_mul" *)

    /*doc:module: implements the inverse HW. Accepts:
    1. Multiplier
    2. Squarer
    3. Public Key HW State
    as interface arguements in order to reuse the same multiplier and squarer
    and keep in sync with the top level module*/
    module mk_inverse#(Ifc_multiplier gf_mul, Wrapper#(FFE, FFE) gf_square, PubKeyGenState pk_gen_state)(Ifc_inverse);

        /*doc:vector: stores the result of each iteration,
        both of which are operands for multiplication*/
        Vector#(2, Reg#(FFE)) v_op <- replicateM(mkReg(0));

        /*doc:vector: stores the addition chain used for finding operands in
        each iteration of the itoh-tsuji algorithm*/
        Bit#(9) v_chain[`BrauerLength] = {`BrauerChain};

        /*doc:reg: stores the number of squarings performed in each iteration*/
        Reg#(Bit#(9)) rg_count <- mkConfigReg(0);

        /*doc:reg: stores the iteration as per the addition chain*/
        Reg#(Bit#(4)) rg_b_iter <- mkConfigReg(0);

        /*doc:reg: stores the state of inversion HW*/
        Reg#(InverseState) rg_state <- mkConfigReg(IDLE);

        /*doc:reg: stores the operand B1 which is reused multiple times*/

        /*doc:rule: reset squaring count in each iteration of brauer chain inv*/
        rule rl_reset_count if (rg_state == WAIT || rg_state == START && pk_gen_state == TRANSFORM);
            $display("Inverse: Resetting count");
            rg_count <= 0;
            rg_state <= (rg_b_iter == (fromInteger(valueOf(`BrauerLength)) - 1)) ? DONE : ITER;
        endrule: rl_reset_count

        /*doc:rule: increment the position of the chain to be iterated upon.
        also changes the state to done if the count has reached it's limit in
        the last iteration*/
        rule rl_advance_b_iter if (rg_state == CHECK && pk_gen_state == TRANSFORM);
            if (rg_count == fn_brauer_op(rg_b_iter))
                begin
                    $display("Inverse: b_iter: %d, rg_count: %d", rg_b_iter, rg_count);
                    $display("Inverse: Advancing b_iter");
                    rg_b_iter <= rg_b_iter + 1;
                    rg_state <= WAIT;
                end
            else
                begin
                    $display("Inverse: b_iter: %d, rg_count: %d", rg_b_iter, rg_count);
                    $display("Inverse: Continue iterating");
                    rg_state <= ITER;
                end
        endrule: rl_advance_b_iter

        /*doc:rule: increment the count in each iteration*/
        rule rl_count if (rg_state == ITER && pk_gen_state == TRANSFORM);
            $display("Inverse: Incrementing count");
            $display("Op1: %x", v_op[0]);
            rg_count <= rg_count + 1;
        endrule: rl_count

        /*doc:rule: perform a single squaring operation*/
        rule rl_sq_once if (rg_state == ITER && pk_gen_state == TRANSFORM);
            $display("Inverse: Squaring once");
            let lv_temp <- gf_square.func(v_op[0]);
            v_op[0] <= lv_temp;
            $display("Op1: %x", lv_temp);
        endrule: rl_sq_once

        /*doc:change the state to CHECK*/
        rule rl_inv_check if (rg_state == ITER && pk_gen_state == TRANSFORM);
            $display("Inverse: Checking for next iteration");
            rg_state <= CHECK;
        endrule: rl_inv_check

        /*doc:rule: perform a single mul op - fires at the end of each iter*/
        rule rl_mul if (rg_state == WAIT && pk_gen_state == TRANSFORM);
            $display("Inverse: Performing multiplication");
            let lv_temp <- gf_mul.mav_multiply(v_op[0], v_op[1]);
            v_op[0] <= lv_temp;
            v_op[1] <= lv_temp;
            $display("Op1: %x\nOp2: %x", lv_temp, lv_temp);
        endrule: rl_mul

        /*doc:method: load the operands and change state to START*/
        method Action ma_start (FFE op1);
            v_op[0] <= op1;
            v_op[1] <= op1;
            rg_b_iter <= 0;
            rg_state <= START;
        endmethod: ma_start

        /*doc:method: performs noAction but the conditon ensures waiting until
        the HW is IDLE or DONE*/
        method Action ma_wait () if (rg_state == DONE || rg_state == IDLE);
            noAction;
        endmethod: ma_wait

        /*doc:method: return the result of inversion and change state to IDLE*/
        method ActionValue#(FFE) mav_result () if (rg_state == DONE);
            rg_state <= IDLE;
            return v_op[1];
        endmethod: mav_result
    endmodule: mk_inverse

endpackage: inverse