package mmm_nomul2;

  import FIFO::*;
  import GetPut::*;
  import LFSR::*;
  import bigadd_updated ::*;
  import Vector ::*;

  interface Ifc_mmm#(numeric type n, numeric type d);
	method Action ma_send_inp(Bit#(n) a, Bit#(n) b, Bit#(n) m);
	method ActionValue#(Bit#(n)) mav_get_result;
	method Bool isReady();
  endinterface

  module mkmmm(Ifc_mmm#(n,d)) provisos(Add#(a__, TLog#(n), n),
			Add#(b__, TLog#(TAdd#(1, n)), TAdd#(TLog#(n), 1)),
			Mul#(c__, d, TAdd#(n, d)),
			Mul#(num_vec, d, n)
  );

	Reg#(Bit#(TAdd#(n,1))) rg_S <- mkReg(0);
	Reg#(Bit#(n)) rg_A <- mkReg(0);
	Reg#(Bit#(n)) rg_B <- mkReg(0);
	Reg#(Bit#(n)) rg_M <- mkReg(0);
	Reg#(Bit#(TAdd#(TLog#(n),1))) rg_iter <- mkReg(0);
	Reg#(Bool) rg_start <- mkReg(False);
	Reg#(Bool) rg_done <- mkReg(False);
	Reg#(Bit#(16)) counter <- mkReg(0);
	Reg#(Bit#(1)) rg_carry <- mkReg(0);
	Reg#(Bit#(1)) rg_carry2 <- mkReg(0);
	Reg#(Bit#(1)) lv_q <- mkReg(0);

	Vector#(num_vec, Reg#(Bit#(d))) out <- replicateM(mkReg(0));

	let d_v = fromInteger(valueOf(d));
	

	Reg#(Int#(10)) rg_state <- mkReg(0);

	Ifc_bigadd#(d) ba_mod <- mkBigAdd;

	rule rl_calc_q(rg_state==4);
	  if(rg_A[rg_iter]!=0) begin
		lv_q <= rg_S[0]+rg_B[0];
		$display("q = %b, cmd: %b, pos: %d", rg_S[0]+rg_B[0], rg_A[rg_iter], rg_iter);
	  end
	  else begin
		lv_q <= rg_S[0];
		$display("q = %b, cmd: %b, pos: %d", rg_S[0], rg_A[rg_iter], rg_iter);
	  end
	  rg_state<=1;
	endrule

	rule rl_init_add(rg_state==1);
	  if(rg_A[rg_iter]==1 && lv_q==0) begin
      if(counter<(fromInteger(valueOf(n)/valueOf(d)))) begin
        let lv_temp <- ba_mod.addn(rg_S[d_v*counter+d_v-1:d_v*counter], rg_B[d_v*counter+d_v-1:d_v*counter], rg_carry);
        $display("st: %d, pos: %d", (d_v*counter+d_v-1), (d_v*counter));
		$display("add: %h", lv_temp);
		out[counter] <= lv_temp[d_v-1:0];
        rg_carry <= lv_temp[d_v];
		$display("carry: %b", lv_temp[d_v]);
        counter<=counter+1;
      end
      else begin
        if(rg_iter==fromInteger(valueOf(n)-1))
          rg_state<=5;
        else
        rg_state<=4;
      counter<=0;
      rg_carry <= 0;
      rg_iter <= rg_iter+1;
      let lv_S = ({rg_carry+rg_S[fromInteger(valueOf(n))],pack(readVReg(out))})>>1;
      lv_S[fromInteger(valueOf(n))] = rg_carry&rg_S[fromInteger(valueOf(n))];
      rg_S <= lv_S;
      end
	  end
	  else if(rg_A[rg_iter]==0 && lv_q==0) begin
      rg_S <= rg_S>>1;
      rg_iter <= rg_iter+1;
      if(rg_iter==fromInteger(valueOf(n)-1))
        rg_state<=5;
      else
        rg_state<=4;
	  end
	  else if(rg_A[rg_iter]==0 && lv_q==1) begin
      if(counter<(fromInteger(valueOf(n)/valueOf(d)))) begin
        let lv_temp <- ba_mod.addn(rg_S[d_v*counter+d_v-1:d_v*counter], rg_M[d_v*counter+d_v-1:d_v*counter], rg_carry);
        out[counter] <= lv_temp[d_v-1:0];
        rg_carry <= lv_temp[d_v];
        counter<=counter+1;
      end
		else begin
		  if(rg_iter==fromInteger(valueOf(n)-1))
			  rg_state<=5;
		  else
        rg_state<=4;
      counter<=0;
      rg_iter <= rg_iter+1;
      rg_carry <= 0;
      let lv_S = ({rg_carry+rg_S[fromInteger(valueOf(n))],pack(readVReg(out))})>>1;
      lv_S[fromInteger(valueOf(n))] = rg_carry&rg_S[fromInteger(valueOf(n))];
      rg_S <= lv_S;
		  end
	  end
	  else begin
      if(counter<(fromInteger(valueOf(n)/valueOf(d)))) begin
        let lv_temp <- ba_mod.addn(rg_S[d_v*counter+d_v-1:d_v*counter], rg_B[d_v*counter+d_v-1:d_v*counter], rg_carry);
        out[counter] <= lv_temp[d_v-1:0];
        rg_carry <= lv_temp[d_v];
        counter<=counter+1;
      end
      else begin
        rg_state<=3;
        counter<=0;
        rg_carry2 <= rg_carry&rg_S[fromInteger(valueOf(n))];
        rg_S <= ({rg_carry+rg_S[fromInteger(valueOf(n))],pack(readVReg(out))});
        let lv_S = ({rg_carry+rg_S[fromInteger(valueOf(n))],pack(readVReg(out))})>>1;
        lv_S[fromInteger(valueOf(n))] = rg_carry&rg_S[fromInteger(valueOf(n))];
        rg_carry <= 0;
      end
	  end
	endrule

	rule rl_next_ass(rg_state==3);
	  if(counter<(fromInteger(valueOf(n)/valueOf(d)))) begin
		let lv_temp <- ba_mod.addn(rg_S[d_v*counter+d_v-1:d_v*counter], rg_M[d_v*counter+d_v-1:d_v*counter], rg_carry);
		out[counter] <= lv_temp[d_v-1:0];
		rg_carry <= lv_temp[d_v];
		counter<=counter+1;
	  end
	  else begin
		if(rg_iter==fromInteger(valueOf(n)-1))
		  rg_state<=5;
		else
		  rg_state<=4;
		counter<=0;
		let lv_S = ({rg_carry+rg_S[fromInteger(valueOf(n))],pack(readVReg(out))})>>1;
		lv_S[fromInteger(valueOf(n))] = rg_carry2|(rg_carry&rg_S[fromInteger(valueOf(n))]);
		rg_S<= lv_S;
		rg_carry <= 0;
		rg_iter <= rg_iter+1;
	  end
	endrule

	rule final_check(rg_state==5);
	  rg_iter<=0;
	  if(rg_S>=zeroExtend(rg_M)) begin
      if(counter<(fromInteger(valueOf(n)/valueOf(d)))) begin
        let lv_temp <- ba_mod.addn(rg_S[d_v*counter+d_v-1:d_v*counter], (~(rg_M)|1)[d_v*counter+d_v-1:d_v*counter],rg_carry);
        out[counter] <= lv_temp[d_v-1:0];
        rg_carry <= lv_temp[d_v];
        counter<=counter+1;
      end
      else begin
        rg_state<=9;
        counter<=0;
        rg_carry <= 0;
        rg_S <= ({rg_carry+rg_S[fromInteger(valueOf(n))],pack(readVReg(out))});
      end
	  end
	  else begin
		  rg_state<=9;
	  end
	endrule

	method Action ma_send_inp(Bit#(n) a, Bit#(n) b, Bit#(n) m) if(rg_state==0);
	  $display("MUL_MOD: \n\nA: %h, B: %h, M: %h", a, b, m);
	  rg_A<= a;
	  rg_B<= b;
	  rg_M<= m;
	  rg_S<= 0;
	  rg_start<= True;
	  rg_state<=4;
	  counter<=0;
	endmethod

	method ActionValue#(Bit#(n)) mav_get_result if(rg_state==9);
	  rg_start<= False;
	  rg_done<= False;
	  rg_state<=0;
	  return truncate(rg_S);
	endmethod

	method Bool isReady();
	  if(rg_state==0 || rg_state==9)
		return True;
	  else
		return False;
	endmethod
  endmodule

  module mkTb(Empty);
	Reg#(Bool) rdy <- mkReg(False);

	Ifc_mmm#(2048, 128) mul_mod <- mkmmm;

	rule rl_start(!rdy);
		mul_mod.ma_send_inp(
			2048'h3EF8F0B6A84A7C9F60C53609493A6E5D97550553669A8FF328051AD8918A29A7C714E0F32DDC5C12097C53F50EAE335EEF73081E66D54AC2334C278E016417DD9E562BFA43B11E3913B923D6162F0D9D0779D53EE54C2CC7F7A57982DE24755209FCF142CC0062DC51F0567FDD21312CCEE613EFF40597E20980E8E2E7972067D771ED20A7DFCA15727B777A243E19335404A6DBB0FBAC64D73AC9F1436E40BED14745E6DFC26C8BB7813901CB1D9FF2FFE49D72C542E7DB928DF7E46F7CBB54C60862B1FFDEA43767956F1C8F46F0952E5BAA83FCA5ADB92C9C555E1160648F97B129E1FA121B20BFAA7631E79366E8A1211364E90AA492F820D620F7ECCEB8,
			2048'h10001,
			2048'hDBC6686641E484AD414CAC014AA5735FE6BC4382438EDBDA4E0B0712E03D2E0058A64126828D0A9157B761B563469BA4388B06D4D3EF129DF72F98806C141E049D8A7AED75063BF585F6F26F04E2A6060C41FC3336FC0D6C316DBEF1DE4E16AE095F470404A15298089BCB9EFB6F71FB903374D9B2C1849BF805780278DFC49D2C801D0BB6EEDD7B3445BDF3D6F14BE26E408DBC2B65FFA9F74882929378E7F52C1837BD35AF9EF346CFB93E4ADBE96245BEBBF260416C82B2E6EC5073294D64DFAAF29084EDDCADE68BE1BBE4387F4EE0D1297B44F553EB03EBFA2589592F74ADCD29BB961AE1A32BCB00F5793F132B552CDE09A829CFF240A5F85EB30B9467
		);
		rdy <= True;
		$display("Started");
	endrule: rl_start

	rule rl_get_result (rdy);
		if(mul_mod.isReady) begin
			let lv_temp <- mul_mod.mav_get_result();
			$display($time, "Result:  %h", lv_temp);
			$finish(0);
		end
	endrule: rl_get_result
  endmodule: mkTb
endpackage
