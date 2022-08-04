package issue;

    import UniqueWrappers :: * ;

    typedef Bit#(233) Bit233;

    function Bit233 fn_xor (Bit233 a, Bit233 b);
        return a ^ b;
    endfunction: fn_xor

endpackage: issue