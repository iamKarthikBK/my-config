package primitives;

    `include "accel.defines"

    import Vector :: * ;

    /*doc:note: FFE is the type used fr any finite field element.
    `KeySize is obtained from accel.defines*/
    typedef Bit#(`KeySize) FFE;
    /*doc:note: FFE_L is the type used for any Finite field element that is
    yet to be reduced back into the galois field using a mod operation*/
    typedef Bit#(`DoubleKeySize) FFE_L;

    /*doc:struct: TPoint is a structure used to define points in the
    L-D projective co-ordinate system, in 3 co-ordinates*/
    typedef struct {FFE x; FFE y; FFE z;} TPoint deriving(Bits, FShow, Eq);

    /*doc:struct: TPointA is a structure used to define points in the affine
    transformed co-ordinate system using 2 co-ordinates*/
    typedef struct {FFE x; FFE y;} TPointA deriving(Bits, FShow, Eq);

    /*doc:enum: PubKeyGenState is the enumeration of the states used inside
    the mk_pubkey_gen module. defination here facilitates imports*/
    typedef enum {IDLE, COMPUTE, TRANSFORM, READY} PubKeyGenState deriving (Bits, Eq);

    /*doc:instance: default value instance for struct TPoint*/
    instance DefaultValue#(TPoint);
        defaultValue = TPoint { x : 0, y : 0, z: 0 };
    endinstance

    /*doc:instance: default value instance for struct TPointA*/
    instance DefaultValue#(TPointA);
        defaultValue = TPointA { x : 0, y : 0 };
    endinstance

    /*doc:function: performs XOR on two operands of type FFE, returns type FFE*/
    function FFE fn_xor (FFE op1, FFE op2);
        return (op1 ^ op2);
    endfunction: fn_xor

    /*doc:function: insert zeroes at every alternate position of the input FFE*/
    function FFE_L fn_insert_zeroes (FFE input_value);
        FFE_L lv_store = 0;
        for (   Integer lv_counter_1 = 0;
                lv_counter_1 < fromInteger(valueOf(`KeySize));
                lv_counter_1 = lv_counter_1 + 1)
            lv_store[2 * lv_counter_1] = input_value[lv_counter_1];
        return(lv_store);
    endfunction: fn_insert_zeroes

    /*doc:function: perform folding XOR from `DoubleKeySize to `KeySize width*/
    function FFE fn_fold_reduce(FFE_L x);
        return x[232:0] ^ zeroExtend(x[464:233]) ^ {x[391:233],74'b0} ^ zeroExtend(x[464:392]) ^ zeroExtend({x[464:392],74'b0});
        /*doc:note:this function has to be modified for a pentanomial*/
    endfunction: fn_fold_reduce

    /*doc:function: return calls to insert_zeroes followed by fold_reduce,
    performs squaring in the binary extended galois field*/
    function FFE fn_square (FFE to_square);
        return fn_fold_reduce(fn_insert_zeroes(to_square));
    endfunction: fn_square

    /*doc:function: adjust an x-bit input to a y-bit width*/
    function Bit#(y) fn_adjust(Bit#(x) inp);
        Bit#(TAdd#(x,y)) lv= zeroExtend(inp);
        return truncate(lv);
    endfunction : fn_adjust

    /*doc:function: perform mxy operation*/
    function Bit#(1) fn_mxy(Bit#(n)a, Bit#(n)b, Integer i, Integer j);
        Bit#(1) ans = (a[i] ^ a[j]) & (b[i] ^ b[j]);
        return ans;
    endfunction: fn_mxy
    
    /*doc:function: perform mx operation*/
    function Bit#(1) fn_mx(Bit#(n)a, Bit#(n)b, Integer i);
        Bit#(1) ans = a[i] & b[i];
        return ans;
    endfunction: fn_mx

    /*doc:function: returns the number of times squaring is to be performed
    as per the defined addition chain*/
    function Bit#(9) fn_brauer_op(Bit#(4) curr_pos);
        case (curr_pos)
            // 0: return x;
            0: return 1;
            1: return 1;
            2: return 3;
            3: return 1;
            4: return 7;
            5: return 14;
            6: return 1;
            7: return 29;
            8: return 58;
            9: return 116;
        endcase
    endfunction: fn_brauer_op
    /*doc:note:this function will need to be generated using some sort of a template in python*/

    /*doc:function: find the position of the first bit that is set in the operand*/
    function Int#(8) fn_find_first_set(FFE inp);
        Int#(8) keysize = fromInteger(valueOf(`KeySize));
        for (Int#(8) i = 0; i < keysize; i = i + 1)
        begin
            if (inp[i] == 1)
                return i;
        end
        return -1;
    endfunction: fn_find_first_set

endpackage: primitives