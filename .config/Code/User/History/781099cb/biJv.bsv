package scalar_mult;

    `include "accel.defines"

    import primitives :: * ;
    import multiplier :: * ;
    import inverse    :: * ;
    import group_ops  :: * ;
    import StmtFSM    :: * ;
    import UniqueWrappers :: * ;
    import ConfigReg  :: * ;
    import transformation :: * ;

    /*doc:interface: provides the interface for scalar multiplication*/
    interface Ifc_scalar_mult;
        method Action ma_scalar_mult (TPointA to_multiply, FFE scalar);
        method ActionValue#(TPoint) mav_result      ();
    endinterface: Ifc_scalar_mult

    /*doc:enum: defines the enumeration for states in scalar mult hardware*/
    typedef enum {IDLE, TRANSFORM_AP, FSM} ScalarMultStateType deriving (Bits, Eq);

    /*doc:module: implements the elliptic curve scalar multiplication algorithm
    using the montgomery's ladder approach. Accepts:
    1. Squarer
    2. Adder
    3. Multiplier
    4: Group Ops Interface
    5: Transformation Interface
    Public Key Generation State
    as interface arguements.*/
    module mk_scalar_mult#( Ifc_multiplier   gf_mul,
                            Ifc_transform_ap trans_ap,
                            PubKeyGenState   pk_gen_state)(Ifc_scalar_mult);

        /*doc:reg: holds the state for scala multiplication*/
        Reg#(ScalarMultStateType) rg_state <- mkConfigReg(IDLE);

        /*doc:reg: holds the transformed point in affine co-ordinate system*/
        Reg#(TPointA) rg_data_A       <- mkReg(defaultValue);

        /*doc:reg: holds the transformed point in projective co-ordinate system*/
        Reg#(TPoint) rg_data_P       <- mkReg(defaultValue);

        /*doc:reg: holds the waiting status for doubling*/
        Reg#(Bool) rg_wait_d <- mkConfigReg(False);

        /*doc:reg: holds the waiting status for add*/
        Reg#(Bool) rg_wait_a <- mkConfigReg(False);

        /*doc:reg: holds the ready status for addition*/
        Reg#(Bool) rg_st_add <- mkConfigReg(False);

        /*doc:reg: holds the ready status for outputs*/
        Reg#(Bool) rg_rdy <- mkConfigReg(False);

        /*doc:reg: holds the value of count upto `KeySize*/
        Reg#(Bit#(8)) rg_counter <- mkConfigReg(0);

        /*doc:reg: holds the scalar to multiply with*/
        Reg#(FFE) rg_scalar <- mkReg(0);

        Ifc_point_add    pa_block <- mk_point_add(gf_square, gf_mul, gf_add, pk_gen_state, rg_st_add);
        Ifc_point_double pd_block <- mk_point_double(gf_square, gf_square2, gf_mul, gf_add, gf_add2, pk_gen_state, rg_st_add);

        /*doc:rule: transform from affine to projective co-ordinates*/
        rule rl_transform_ap if (rg_rdy == False && rg_state == TRANSFORM_AP && pk_gen_state == COMPUTE);
            let transformed <- trans_ap.mav_transform_ap(tuple2(rg_data_A.x, rg_data_A.y));
            rg_data_P <= TPoint{x: tpl_1(transformed), y: tpl_2(transformed), z: tpl_3(transformed)};
            rg_state <= FSM;
        endrule: rl_transform_ap

        /*doc:rule: decrements the counter*/
        rule rl_decrement if (rg_rdy == False && rg_state == FSM && rg_wait_d == False && rg_counter != 0 && pk_gen_state == COMPUTE);
            rg_counter <= rg_counter - 1;
        endrule: rl_decrement

        /*doc:rule: invokes point double*/
        rule rl_double if (rg_rdy == False && rg_state == FSM && rg_wait_d == False && pk_gen_state == COMPUTE);
            pd_block.ma_point_double_start(rg_data_P);
            rg_wait_d <= True;
        endrule: rl_double

        /*doc:rule: recieved point double result*/
        rule rl_double_recv if (rg_rdy == False && rg_state == FSM && rg_wait_d == True && rg_st_add == False && pk_gen_state == COMPUTE);
            if (rg_scalar[rg_counter - 1] == 1)
            begin
                rg_st_add <= True;
                pa_block.ma_point_add_start(pd_block.mv_point_double_result(), rg_data_A);
                rg_wait_a <= True;
            end
            else
            begin
                rg_data_P <= pd_block.mv_point_double_result();
                rg_wait_d <= False;
            end
        endrule: rl_double_recv

        /*doc:rule: recieves point add result*/
        rule rl_add_recv if (rg_rdy == False && rg_state == FSM && rg_wait_d ==True && rg_st_add == True && rg_wait_a == True && pk_gen_state == COMPUTE);
            rg_data_P <= pa_block.mv_point_add_result();
            rg_st_add <= False;
            rg_wait_a <= False;
            rg_wait_d <= False;
        endrule: rl_add_recv

        /*doc:rule: set rg_rdy to True once the last result has been recieved*/
        rule rl_set_rdy if (rg_rdy == False && rg_state == FSM && rg_counter == 1 && rg_wait_d == False && pk_gen_state == COMPUTE);
            rg_rdy <= True;
        endrule: rl_set_rdy

        /*doc:method: stores inputs into registers and changes state to TRANSFORM_AP*/
        method Action ma_scalar_mult (TPointA to_multiply, FFE scalar) if (rg_state == IDLE && rg_rdy == False);
            rg_data_A <= to_multiply;
            rg_scalar <= scalar;
            let first_set = fn_find_first_set(scalar);
            if (isValid(first_set))
            begin
                rg_counter <= fromMaybe(0, first_set) + 1;
                rg_state <= TRANSFORM_AP;
                rg_wait_d <= False;
                rg_st_add <= False;
            end
            else
            begin
                rg_state <= FSM;
                rg_rdy <= True;
                rg_counter <= 0;
            end
            
        endmethod: ma_scalar_mult

        /*doc:method: switched the state of the rgy register to False and returns R0*/
        method ActionValue#(TPoint) mav_result () if (rg_state == FSM && rg_rdy == True);
            rg_state <= IDLE;
            rg_rdy <= False;
            return rg_data_P;
        endmethod: mav_result

    endmodule: mk_scalar_mult

endpackage: scalar_mult