package multiplier;

    `include "accel.defines"
    import primitives :: * ;
    import UniqueWrappers :: * ;

    // /*doc:function: implements the general karatsuba multiplier*/
    // function Bit#(m) fn_gkmul(Bit#(n) a, Bit#(n) b)
    //     provisos( Mul#(2, n, t1), Add#(m , 1, t1));
    //     Bit#(m)c = 0;
    //     Integer m = valueOf(n);
    //     for(Integer i=0; i<=m-2; i=i+1)begin
    //         c[i] = 1'b0;
    //         c[2*m-2-i] = 1'b0;
    //         for(Integer j=0; j<=i/2; j=j+1)begin
    //             if(i == 2*j)begin
    //                 c[i] = c[i] ^ fn_mx(a,b,j);
    //                 c[2*m-2-i] = c[2*m-2-i] ^ fn_mx(a,b,m-1-j);
    //             end
    //             else begin
    //                 c[i] = c[i] ^ fn_mx(a,b,j) ^ fn_mx(a,b,i-j) ^ fn_mxy(a,b,j,i-j);
    //                 c[2*m-2-i] = c[2*m-2-i] ^ fn_mx(a,b,m-1-j) ^ fn_mx(a,b,m-1-i+j) ^ fn_mxy(a,b,m-1-j, m-1-i+j);
    //             end
    //         end
    //     end
    //     for(Integer j=0; j<=(m-1)/2; j=j+1)begin
    //         if(m-1 == 2*j)begin
    //             c[m-1] = c[m-1] ^ fn_mx(a,b,j);
    //         end
    //         else begin
    //             c[m-1] = c[m-1] ^ fn_mx(a,b,j) ^ fn_mx(a,b,m-1-j) ^ fn_mxy(a,b,j, m-1-j);
    //         end
    //     end
    //     return c;
    // endfunction: fn_gkmul

    // /*doc:function: implements the hybrid karatsuba multiplier*/
    // function Bit#(m) fn_hkmul(Bit#(n) a, Bit#(n) b)	
    //     provisos( 	Add#(1, m, TMul#(2, n)),
    //                 Div#(n,2,n_by_2)
    //             );
    //     Bit#(m) ans = ?;
    //     if(valueOf(n)<29)begin
    //         ans = fn_gkmul(a,b);
    //     end	
    //     else begin
    //         Integer sz = valueOf(n);
    //         Integer l = valueOf(n_by_2);
    //         Bit#(TDiv#(n,2)) aDash, bDash;								
    //         if(valueOf(n)%2 == 0)begin	
    //             aDash = a[valueOf(n)-1:l] ^ a[l-1:0];    				
    //             bDash = b[valueOf(n)-1:l] ^ b[l-1:0];	
    //         end
    //         else begin
    //             aDash = a[valueOf(n)-1:l] ^ a[l-2:0];       
    //             aDash[l-1] = a[l-1];
    //             bDash = b[valueOf(n)-1:l] ^ b[l-2:0];		
    //             bDash[l-1] = b[l-1];
    //         end
    //         Bit#(TDiv#(n,2)) 			al = a[l-1:0];
    //         Bit#(TSub#(n,TDiv#(n,2))) 	ah = a[valueOf(n)-1:l];
    //         Bit#(TDiv#(n,2)) 			bl = b[l-1:0];
    //         Bit#(TSub#(n,TDiv#(n,2))) 	bh = b[valueOf(n)-1:l];
    //         Bit#(TSub#(TMul#(2, TDiv#(n,2)), 1))			cp1 	= fn_hkmul(al, bl);
    //         Bit#(TSub#(TMul#(2, TDiv#(n,2)), 1))			cp2 	= fn_hkmul(aDash, bDash);
    //         Bit#(TSub#(TMul#(2,TSub#(n,TDiv#(n,2))), 1))	cp3 	= fn_hkmul(ah, bh);
    //         Bit#(m) cP1= fn_adjust(cp1);
    //         Bit#(m) cP2= fn_adjust(cp2);
    //         Bit#(m) cP3= fn_adjust(cp3);
    //         ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1; 		
    //     end
    //     return ans;
    // endfunction: fn_hkmul

    // /*doc:interface: defines the interface for the multiplier*/
    // interface Ifc_multiplier;
    //     method ActionValue#(FFE) mav_multiply(FFE a, FFE b); 
    // endinterface: Ifc_multiplier

    // /*doc:module: wraps the hybrid karatsuba multiplier using UniqueWrapper and
    // provides an interface to reuse the same multiplication HW*/

    // (* synthesize *)
    // module mk_multiplier(Ifc_multiplier);
    //     Wrapper2#(FFE, FFE, FFE_L) hkmul <- mkUniqueWrapper2(fn_hkmul);

    //     /*doc:method: recieves two operands of type FFE and returns type FFE*/
    //     method ActionValue#(FFE) mav_multiply(FFE a, FFE b);
    //         let ans <- hkmul.func(a, b);
    //         return fn_fold_reduce(ans);
    //     endmethod: mav_multiply
    // endmodule: mk_multiplier

    interface Ifc_multiplier;
        method Action ma_start(FFE x, FFE y);
        method FFE mv_result(); 
        method Bit#(1) mv_status();
    endinterface: Ifc_multiplier

    module mk_Multiplier(Ifc_multiplier);  
        Reg#(FFE_L) product <- mkReg(0);
        Reg#(FFE_L) d       <- mkReg(0);
        Reg#(Bit#(14)) r1       <- mkReg(0);
        Reg#(Bit#(15)) r2       <- mkReg(0);
        Reg#(Bit#(15)) r3       <- mkReg(0);
        Reg#(Bit#(15)) r4       <- mkReg(0);
        Reg#(Bit#(15)) r5       <- mkReg(0);
        Reg#(Bit#(15)) r6       <- mkReg(0);
        Reg#(Bit#(15)) r7       <- mkReg(0);
        Reg#(Bit#(15)) r8       <- mkReg(0);
        Reg#(Bit#(15)) r9       <- mkReg(0);
        Reg#(Bit#(15)) r10       <- mkReg(0);
        Reg#(Bit#(15)) r11       <- mkReg(0);
        Reg#(Bit#(15)) r12       <- mkReg(0);
        Reg#(Bit#(15)) r13       <- mkReg(0);
        Reg#(Bit#(15)) r14       <- mkReg(0);
        Reg#(Bit#(15)) r15       <- mkReg(0);
        Reg#(Bit#(9)) r16        <- mkReg(0);
        Reg#(Bit#(4)) rg_counter <- mkReg(0);
        Reg#(Bit#(1)) rg_busy <- mkReg(0);

        rule rl_multiply if (rg_busy == 1);

            let lv_d1 = r1[0] == 1 ? d : 0 ;  
            let lv_d2 = r2[0] == 1 ? d << 14 : 0;
            let lv_d3 = r3[0] == 1 ? d << 29 : 0; 
            let lv_d4 = r4[0] == 1 ? d << 44 : 0; 
            let lv_d5 = r5[0] == 1 ? d << 59 : 0;      
            let lv_d6 = r6[0] == 1 ? d << 74 : 0;  
            let lv_d7 = r7[0] == 1 ? d << 89 : 0;  
            let lv_d8 = r8[0] == 1 ? d << 104 : 0; 
            let lv_d9 = r9[0] == 1 ? d << 119 : 0;     
            let lv_d10 = r10[0] == 1 ? d << 134 : 0;
            let lv_d11 = r11[0] == 1 ? d << 149 : 0; 
            let lv_d12 = r12[0] == 1 ? d << 164 : 0; 
            let lv_d13 = r13[0] == 1 ? d << 179 : 0;      
            let lv_d14 = r14[0] == 1 ? d << 194 : 0;   
            let lv_d15 = r15[0] == 1 ? d << 209 : 0;  
            let lv_d16 = r16[0] == 1 ? d << 224 : 0;   
            product <= product ^ lv_d1 ^ lv_d2 ^ lv_d3 ^ lv_d4 ^ lv_d5 ^ lv_d6 ^ lv_d7 ^ lv_d8 ^ lv_d9 ^ lv_d10 ^ lv_d11 ^ lv_d12 ^ lv_d13 ^ lv_d14 ^ lv_d15 ^ lv_d16;

            d <= d  <<1;
            r1<= r1 >>1;
            r2<= r2 >>1;
            r3<= r3 >>1;
            r4<= r4 >>1;
            r5<= r5 >>1;
            r6<= r6 >>1;
            r7<= r7 >>1;
            r8<= r8 >>1;
            r9<= r9 >>1;
            r10<= r10 >>1;
            r11<= r11 >>1;
            r12<= r12 >>1;
            r13<= r13 >>1;
            r14<= r14 >>1;
            r15<= r15 >>1;
            r16<= r16 >>1;

            if (rg_counter == 14) begin 
                rg_busy <= 0;
                rg_counter <= 0; end
            else begin
                rg_counter <= rg_counter + 1;     
            end
        endrule: rl_multiply

        method Action ma_start(Bit#(233) x,Bit#(233) y) if (rg_busy == 0);
            d<=zeroExtend(x);	
            rg_busy<= 1;
            r1<=y[13:0]; 
            r2<=y[28:14]; 
            r3<=y[43:29]; 
            r4<=y[58:44]; 
            r5<=y[73:59]; 
            r6<=y[88:74]; 
            r7<=y[103:89]; 
            r8<=y[118:104];
            r9<=y[133:119]; 
            r10<=y[148:134]; 
            r11<=y[163:149]; 
            r12<=y[178:164]; 
            r13<=y[193:179]; 
            r14<=y[208:194]; 
            r15<=y[223:209]; 
            r16<=y[232:224];
            product <= 0;
        endmethod: ma_start

        method Bit#(1) mv_status();
            if (rg_busy == 0) begin
            return 1; end
            else return 0;   
        endmethod: mv_status

        method FFE mv_result() if (rg_busy == 0);
            return fn_fold_reduce(product);                                     
        endmethod: mv_result
    endmodule: mk_Multiplier

endpackage: multiplier