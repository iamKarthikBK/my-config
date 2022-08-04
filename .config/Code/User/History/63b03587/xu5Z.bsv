package mme;
  import FIFO::*;
  import GetPut::*;
  import LFSR::*;

  import mmm_nomul2 ::*;
  import "BDPI" function Bit#(32) golden_result (Bit#(32) a, Bit#(32) e, Bit#(32) m);

  interface Ifc_mme#(numeric type m, numeric type d);
    method Action mmeExp();
    method Bit#(m) getResult();
    method Bool can_take_inp();
    method Bool outp_ready();
  endinterface
  typedef enum {
    Idle, FindExpLength, FindAMonty, StartExp, Compute, Compute1_25, Compute1_5, Compute2, Compute3, Compute4, Done
  } MME_State_type deriving(Bits, Eq, FShow);
  
/*doc:module: This module performs the modular exponentiation needed for RSA. All the four inputs are taken as parameters by this module.  */  
  module mkMME#(Bit#(m) a, Bit#(m) exponent, Bit#(m) n, Bit#(m) r2_mod_n)
    (Ifc_mme#(m, d)) 
  	provisos(Add#(a__, TLog#(m), m),Add#(b__, TLog#(TAdd#(1, m)), TAdd#(TLog#(m), 1)),Add#(c__, m, TMul#(2, m)), Mul#(d__, d, TAdd#(m, d)),Mul#(e__, d, m));//, Add#(0,m,32));
 
    Reg#(Bit#(m)) res <- mkReg(0);
    Reg#(Bit#(m)) a_montg <- mkReg(0);
//    Reg#(Bit#(m)) res_temp <- mkReg(0);
    Reg#(Int#(TAdd#(TLog#(m),1))) i <- mkReg(0);
//    Reg#(Bool) completed <- mkReg(False);

    Reg#(Bit#(m)) counter <- mkReg(0);
  
    Reg#(MME_State_type) rg_state <- mkReg(Idle);
    
    Reg#(Bool) op_ready <- mkReg(False);
    
    
    Ifc_mmm#(m,d) mod_m <- mkmmm;
   
    rule initialise(rg_state==FindExpLength);
      if(res!=0) begin
        i <= i+1;
        res <= res>>1;
      end
      else
        rg_state <= FindAMonty;
      counter<=counter+1;
 //     $display("Initialise i=%d", i);
    endrule
    
    rule convert_A_To_Monty(rg_state==FindAMonty);
      mod_m.ma_send_inp(a,r2_mod_n,n);
      rg_state <= Compute;
      counter<=counter+1;
    endrule
  
    rule compute((rg_state==Compute) && i>=0);
      let lv_t <- mod_m.mav_get_result();
      a_montg <= lv_t;
      res <= lv_t;
      rg_state <= Compute1_25;
      counter<=counter+fromInteger(valueOf(m));
    endrule
  
    rule loopDecr((rg_state==Compute1_25) && i>=0);
      i<=i-1;
      rg_state<=Compute1_5;
      counter<=counter+1;
    endrule
  
    rule compute1_5 (rg_state==Compute1_5 && i>=0);
      //i<=i-1;
 //     $display("%d", i);
      mod_m.ma_send_inp(res,res,n);
      rg_state <= Compute2;
      counter<=counter+1;
    endrule
  
    rule compute2(rg_state==Compute2 && i>=0 &&mod_m.isReady);
      let lv_t <- mod_m.mav_get_result();
      res <= lv_t;
      if(exponent[i]==1)
        rg_state <= Compute3;
      else begin
        rg_state <= Compute1_25;
      end
      counter<=counter+fromInteger(valueOf(m));
 //     $display("\ncompute2, i=%d\n",i);
    endrule
  
    rule compute3(rg_state==Compute3 && i>=0);
      mod_m.ma_send_inp(res,a_montg,n);
      rg_state <= Compute4;
      counter<=counter+1;
 //     $display("\ncompute3, i=%d\n",i);
    endrule
  
    rule compute4(rg_state==Compute4 && i>=0 &&mod_m.isReady);
      let lv_t <- mod_m.mav_get_result();
      res <= lv_t;
      rg_state <= Compute1_25;
      counter<=counter+fromInteger(valueOf(m));
 //     $display("\ncompute4, i=%d\n",i);
    endrule
    
    rule postProcess(((rg_state==Compute1_25)||(rg_state==Compute1_5)||(rg_state==Compute2))&&(i==-1));      
      mod_m.ma_send_inp(res,1,n);
      rg_state <= Done;
      counter<=counter+1;
 //      $display("\nPOST PROCESS, i=%d\n",i);
    endrule

/*doc:rule: this rule triggers when computation part is complete */     
    rule done(rg_state==Done && i<0 &&mod_m.isReady);
      let lv_t <- mod_m.mav_get_result();
      res <= lv_t;
      rg_state <= Idle;
      op_ready <= True;
      counter<=counter+1;
 //      $display("\nDONE\n");
 //      $display("Number of cycles= %d", counter);
 //      $display("\nRESULT: %h", res);
    endrule
/*    
    rule print(op_ready);
     $display("\nRESULT: %h", res);
     op_ready <= False;
    endrule
*/   
      
/*doc:method: this method takes the inputs and triggers the rules for modular exponentiation  */  
    method Action mmeExp();
 	$display("MME: Start %h,\n %h,\n %h,\n %h\n", a, exponent, n, r2_mod_n);
      res<=exponent;
      rg_state<=FindExpLength;
      op_ready <= False; 
      i<=-1;
      counter<=0;
    endmethod

/*doc:method: this method returns the result value  */  
    method Bit#(m) getResult();
      if(res!=n) 
        return res;      
      else
        return 0;
    endmethod

/*doc:method: this method returns a bool value which indicates if we can pass another set of input  */  
    method Bool can_take_inp();
      return (rg_state==Idle);
    endmethod
 
/*doc:method: this method returns a bool value which indicates if output is ready  */    
    method Bool outp_ready();
      return op_ready;
    endmethod
    
  endmodule
  
  
  
module mkTb(Empty);
    Reg#(Bool) rdy <- mkReg(False);
    rule rl_start(!rdy);
      //rsa_mod.mmeExp(1024'd211023, 1024'd101232, 1024'd410431, 1024'd25);
      let a = 2048'h3EF8F0B6A84A7C9F60C53609493A6E5D97550553669A8FF328051AD8918A29A7C714E0F32DDC5C12097C53F50EAE335EEF73081E66D54AC2334C278E016417DD9E562BFA43B11E3913B923D6162F0D9D0779D53EE54C2CC7F7A57982DE24755209FCF142CC0062DC51F0567FDD21312CCEE613EFF40597E20980E8E2E7972067D771ED20A7DFCA15727B777A243E19335404A6DBB0FBAC64D73AC9F1436E40BED14745E6DFC26C8BB7813901CB1D9FF2FFE49D72C542E7DB928DF7E46F7CBB54C60862B1FFDEA43767956F1C8F46F0952E5BAA83FCA5ADB92C9C555E1160648F97B129E1FA121B20BFAA7631E79366E8A1211364E90AA492F820D620F7ECCEB8;
      let d = 2048'h10001;
      let n = 2048'hDBC6686641E484AD414CAC014AA5735FE6BC4382438EDBDA4E0B0712E03D2E0058A64126828D0A9157B761B563469BA4388B06D4D3EF129DF72F98806C141E049D8A7AED75063BF585F6F26F04E2A6060C41FC3336FC0D6C316DBEF1DE4E16AE095F470404A15298089BCB9EFB6F71FB903374D9B2C1849BF805780278DFC49D2C801D0BB6EEDD7B3445BDF3D6F14BE26E408DBC2B65FFA9F74882929378E7F52C1837BD35AF9EF346CFB93E4ADBE96245BEBBF260416C82B2E6EC5073294D64DFAAF29084EDDCADE68BE1BBE4387F4EE0D1297B44F553EB03EBFA2589592F74ADCD29BB961AE1A32BCB00F5793F132B552CDE09A829CFF240A5F85EB30B9467;
      let rr = 2048'h5F1BAFAEF256B913445FE4514483574C86782E756C82038423AB46592E99C34E85F1A4F59070588F214AED12F0A479EBDE82ACF55CA7C29D5501691DEBC736A4E57A88B2BC6463F151C7F6F9355862AB56E258B3B161DBB6663568B19D8C70B1D2CD9AE9ADA2F0907E8C01D3C388CC73A96E0DFFB75A1F0E168D932794D27811F6B59A7531C3BAF8D68C5CA763407C3602E466BD2155BF5D77CD0360F2BDBE60949B72DF09B72AEDE8CB9F1D0FAF40929831A8E9C292E69D06576E9751EF3C228DD3C6F1BE06E716BC6E86AC483DBB8D3DA82855E8FB45653A3B8296E414F141F1C7774E2E38C1D36154A21083D99F28E0A7823CFD10F86398D35C6C55627C06;
      Ifc_mme#(2048,128) rsa_mod <-mkMME(a,d,n,rr);
      //let a = 128'h3EF8F0B6A84A7C9F60C53609493A6E5D;
      //let d = 128'h10001;
      //let n = 128'h4EF8F0B6A84A7C9F60C53609493A6E5D;
      //let rr = 128'd84342486036352056769109228323799158176;
      rsa_mod.mmeExp();
      //3ef8f0b6a84a7c9f60c53609493a6e5d
      //211310595204847329841774944651329564253

      //rsa_mod.mmeExp(2048'd211023, 2048'd101232, 2048'd410431, 2048'd269910);
      //rsa_mod.mmeExp(2048'd23, 2048'd10, 2048'd101, 2048'd19);
      $display("a: %h", a);
      $display("d: %h", d);
      $display("n: %h", n);
      $display("r: %h", rr);
      rdy <= True;
    endrule

    rule rl_get_result (rdy);
      if(rsa_mod.isReady) begin
        $display($time, "Result:  %h", rsa_mod.getResult);
        $finish(0);
      end
    endrule
endmodule


/*
  module mkTb(Empty);
      Ifc_mme#(32) mme_mod <-mkMME;
      LFSR#(Bit#(32)) lfsr1 <- mkLFSR_32;
      LFSR#(Bit#(32)) lfsr2 <- mkLFSR_32;
      LFSR#(Bit#(32)) lfsr3 <- mkLFSR_32;
      Reg#(Bit#(32)) rg_A <- mkReg(1);
      Reg#(Bit#(32)) rg_E <- mkReg(1);
      Reg#(Bit#(32)) rg_M <- mkReg(1);
      Reg#(Bit#(29)) rg_counter <- mkReg(0);
      Reg#(Bool) rg_start <- mkReg(False);
      Reg#(Bool) rg_given_inputs <- mkReg(False);
      Reg#(Bit#(32)) rg_B <- mkReg(2);
      Reg#(Bit#(32)) rg_baseExp <- mkReg(64);
  
      rule rl_seed(!rg_start);
        rg_start<= True;
        lfsr1.seed('h10);
        lfsr2.seed('h9);
        lfsr3.seed('h8);
      endrule
  
      rule rl_start(rg_start && !rg_given_inputs);
        let lv_M= (lfsr3.value>>1 | 'd1);  //Always odd
        lfsr3.next;
        let lv_A= lfsr1.value % lv_M;   //Making sure that input 1 is lesser than M
        lfsr1.next;
        let lv_E= lfsr2.value % lv_M;   //Making sure that input 2 is lesser than M
        lfsr2.next;
       
        //Bit#(34) r2_mod_M= zeroExtend((2^64) % lv_M);
        //lv_M= 'd101;
        Bit#(32) r2_mod_M= golden_result(zeroExtend(rg_B), rg_baseExp, zeroExtend(lv_M));
        //$display("R2 mod m %h", r2_mod_M); 
        if(lv_A!=0 && lv_E!=0 && lv_A!=1) begin
          mme_mod.mmeExp(lv_A, lv_E, lv_M, truncate(r2_mod_M));
          //$display("A: %d E: %d M: %d r2_mod_M: %d", lv_A, lv_E, lv_M, r2_mod_M);
          rg_A<= lv_A;
          rg_E<= lv_E;
          rg_M<= lv_M;
          rg_given_inputs<= True;
        end
      endrule
  
      rule rl_get_result(mme_mod.isReady && rg_given_inputs);
        let res= mme_mod.getResult;
        //$display("\nNew output..");
        let expected_res= golden_result(zeroExtend(rg_A), zeroExtend(rg_E), zeroExtend(rg_M));  // (rg_A ^ rg_E ) % rg_M;
        rg_counter<= rg_counter+1;
        rg_given_inputs<= False;
        if(truncate(expected_res) != res) begin
          $display($time,"\t Mismatch!! Golden result: %d", expected_res);
          $display($time,"\t %d. A: %d E: %d M: %d Result:  %d", rg_counter, rg_A, rg_E, rg_M, res);
          $finish(0);
        end
        if(rg_counter=='d1000000) begin
          $display("Checked %d testcases. MME works!", rg_counter);
          $finish(0);
        end
      endrule
  endmodule

*/
endpackage
