package multiplier;
     
interface Multiplier_ifc;
  method Action start(Bit#(233) x, Bit#(233) y);
 method Bit#(465) result(); 
 method Bit#(1) status();
endinterface

module mkMultiplier(Multiplier_ifc);  
   Reg#(Bit#(465)) product <- mkReg(0);
   Reg#(Bit#(465)) d       <- mkReg(0);
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
   
rule multiply if (rg_busy == 1);

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
    else  begin rg_counter <= rg_counter + 1;     
       end
  endrule
  

  method Action start(Bit#(233) x,Bit#(233) y) if (rg_busy == 0);
  
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
      
  endmethod 
  
   method Bit#(1) status();
    if (rg_busy == 0) begin
     return 1; end
    else return 0;   
   endmethod
  
method Bit#(465) result() if (rg_busy == 0);
       return product;                                     
  endmethod

endmodule

module tbmkMultiplier();
 
     Reg#(int) state <-mkReg(0);
     Multiplier_ifc m <- mkMultiplier();

      rule step1;
       m.start(     233'h12eeda3493c16230768a46ab073f6a5433fe5617bd4afe57cc825d27276 ,
                    233'h1c0c4c68f81c3bd0202a4ec28ffd13e208f4271701cd96887a5806028fc );
           state <= 1 ;
      endrule

      rule finish (state == 1);
          $display("product = %h", m.result());
      $finish();
    endrule

      rule rl_cycle_Ack;
        $display("Ack");
      endrule: rl_cycle_Ack
   
endmodule  	 

endpackage       