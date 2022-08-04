package multiplier;

    `include "accel.defines"
    import primitives :: * ;
    import UniqueWrappers :: * ;

    function Bit#(m) fn_gkmul(Bit#(n) a, Bit#(n) b)
        provisos( Mul#(2, n, t1), Add#(m , 1, t1));
        Bit#(m)c = 0;
        Integer m = valueOf(n);
        for(Integer i=0; i<=m-2; i=i+1)begin
            c[i] = 1'b0;
            c[2*m-2-i] = 1'b0;
            for(Integer j=0; j<=i/2; j=j+1)begin
                if(i == 2*j)begin
                    c[i] = c[i] ^ mx(a,b,j);
                    c[2*m-2-i] = c[2*m-2-i] ^ mx(a,b,m-1-j);
                end
                else begin
                    c[i] = c[i] ^ mx(a,b,j) ^ mx(a,b,i-j) ^ mxy(a,b,j,i-j);
                    c[2*m-2-i] = c[2*m-2-i] ^ mx(a,b,m-1-j) ^ mx(a,b,m-1-i+j) ^ mxy(a,b,m-1-j, m-1-i+j);
                end
            end
        end
        for(Integer j=0; j<=(m-1)/2; j=j+1)begin
            if(m-1 == 2*j)begin
                c[m-1] = c[m-1] ^ mx(a,b,j);
            end
            else begin
                c[m-1] = c[m-1] ^ mx(a,b,j) ^ mx(a,b,m-1-j) ^ mxy(a,b,j, m-1-j);
            end
        end
        return c;
    endfunction: fn_gkmul

    function Bit#(m) fn_hkmul(Bit#(n) a, Bit#(n) b)	
        provisos( 	Add#(1, m, TMul#(2, n)),
                    Div#(n,2,n_by_2)
                );
        Bit#(m) ans = ?;
        if(valueOf(n)<29)begin
            ans = fn_gkmul(a,b);
        end	
        else begin
            Integer sz = valueOf(n);
            Integer l = valueOf(n_by_2);
            Bit#(TDiv#(n,2)) aDash, bDash;								
            if(valueOf(n)%2 == 0)begin	
                aDash = a[valueOf(n)-1:l] ^ a[l-1:0];    				
                bDash = b[valueOf(n)-1:l] ^ b[l-1:0];	
            end
            else begin
                aDash = a[valueOf(n)-1:l] ^ a[l-2:0];       
                aDash[l-1] = a[l-1];
                bDash = b[valueOf(n)-1:l] ^ b[l-2:0];		
                bDash[l-1] = b[l-1];
            end
            Bit#(TDiv#(n,2)) 			al = a[l-1:0];
            Bit#(TSub#(n,TDiv#(n,2))) 	ah = a[valueOf(n)-1:l];
            Bit#(TDiv#(n,2)) 			bl = b[l-1:0];
            Bit#(TSub#(n,TDiv#(n,2))) 	bh = b[valueOf(n)-1:l];
            Bit#(TSub#(TMul#(2, TDiv#(n,2)), 1))			cp1 	= fn_hkmul(al, bl);
            Bit#(TSub#(TMul#(2, TDiv#(n,2)), 1))			cp2 	= fn_hkmul(aDash, bDash);
            Bit#(TSub#(TMul#(2,TSub#(n,TDiv#(n,2))), 1))	cp3 	= fn_hkmul(ah, bh);
            Bit#(m) cP1= fn_adjust(cp1);
            Bit#(m) cP2= fn_adjust(cp2);
            Bit#(m) cP3= fn_adjust(cp3);
            ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1; 		
        end
        return ans;
    endfunction: fn_hkmul

    interface Ifc_multiplier;
        method ActionValue#(FFE) mav_multiply(FFE a, FFE b); 
    endinterface: Ifc_multiplier

    (*synthesize*)
    module mk_multiplier(Ifc_multiplier);
        Wrapper2#(FFE, FFE, FFE_L) hkmul <- mkUniqueWrapper2(fn_hkmul);
        method ActionValue#(FFE) mav_multiply(FFE a, FFE b);
            let ans <- hkmul.func(a, b);
            return fn_fold_reduce(ans);
        endmethod: mav_multiply
    endmodule: mk_multiplier
endpackage: multiplier