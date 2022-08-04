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
	  if(rg_A[rg_iter]!=0)
		lv_q <= rg_S[0]+rg_B[0];
	  else
		lv_q <= rg_S[0];
	  rg_state<=1;
	endrule

	rule rl_init_add(rg_state==1);
	  if(rg_A[rg_iter]==1 && lv_q==0) begin
		if(counter<(fromInteger(valueOf(n)/valueOf(d)))) begin
		  let lv_temp <- ba_mod.addn(rg_S[d_v*counter+d_v-1:d_v*counter], rg_B[d_v*counter+d_v-1:d_v*counter], rg_carry);
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
	Ifc_mmm#(2048, 256) mmm_inst <-mkmmm;

	rule rl_start;
	  let lv_A = 2048'h439e59ec5d5f7892f5835d681bfb58b8fc493b50f0a568c69fa4d4c6d88d5afe906f8cd32a16ecb44c44c9368839defefa620fc298f8409d57df0378d2769c3d3562573138e1f44f531e4869f148c449554008a96458c0d015e519c7edfa3edc05d8d4913df4241d5c60cd035db03bc5816e46bb7b79b950f3ad3293300739dbeb1d4936fcfa165d25ef3dbbd9fb60005ba9d37827c8fe88adb5e4f639eb159e8d5262ad39ff2d3ac4c999a94b1ccddc24b5f74fd573fbd1a0b20e812ae2902ebf1a44cbd49abc5c8e5ee0d796459c227795675ea1d7a7ba19a4f8d735ed7741040a23c6458db02784a1499b19d80b69db3754a075cce63ebd288b19b4f13b6c;
	  let lv_B = 2048'h3ef8f0b6a84a7c9f60c53609493a6e5d97550553669a8ff328051ad8918a29a7c714e0f32ddc5c12097c53f50eae335eef73081e66d54ac2334c278e016417dd9e562bfa43b11e3913b923d6162f0d9d0779d53ee54c2cc7f7a57982de24755209fcf142cc0062dc51f0567fdd21312ccee613eff40597e20980e8e2e7972067d771ed20a7dfca15727b777a243e19335404a6dbb0fbac64d73ac9f1436e40bed14745e6dfc26c8bb7813901cb1d9ff2ffe49d72c542e7db928df7e46f7cbb54c60862b1ffdea43767956f1c8f46f0952e5baa83fca5adb92c9c555e1160648f97b129e1fa121b20bfaa7631e79366e8a1211364e90aa492f820d620f7ecceb8;
	  let lv_BM = 2048'hb0b957efc021096e3443cd0a34679db35973e9240885e7289a6e9bea2731ba6b93a90796aa12295d3a7af60dc3c7509c5786ed86d0453be5d0a9d5d177f6de3d01198045b022d33e6b3b214abd9f03b208beba58b49040a26fb52e7a0bba30915b4eda1c0a8d36e5339ee577654beaf43dec82e53473521b0a95237a2dc9de4e4af7d0f092bcd73e0b498976b38aac4f75207943a6becda60dd12853989c469da42bb619e18050f370fc15fb482e9546e9baf4a78465332f0b0e95fc505bdd71b143a1c51bcb5ec55af0ca0b4ca9de69c606bc245cb570673c39505be1ef82330f9d404b95f22f2947c547176ce02c94bd3742d94d1b75ba84c8212cefca3f52;
	  let lv_M = 2048'hDBC6686641E484AD414CAC014AA5735FE6BC4382438EDBDA4E0B0712E03D2E0058A64126828D0A9157B761B563469BA4388B06D4D3EF129DF72F98806C141E049D8A7AED75063BF585F6F26F04E2A6060C41FC3336FC0D6C316DBEF1DE4E16AE095F470404A15298089BCB9EFB6F71FB903374D9B2C1849BF805780278DFC49D2C801D0BB6EEDD7B3445BDF3D6F14BE26E408DBC2B65FFA9F74882929378E7F52C1837BD35AF9EF346CFB93E4ADBE96245BEBBF260416C82B2E6EC5073294D64DFAAF29084EDDCADE68BE1BBE4387F4EE0D1297B44F553EB03EBFA2589592F74ADCD29BB961AE1A32BCB00F5793F132B552CDE09A829CFF240A5F85EB30B9467;
	  let rr = 2048'h5F1BAFAEF256B913445FE4514483574C86782E756C82038423AB46592E99C34E85F1A4F59070588F214AED12F0A479EBDE82ACF55CA7C29D5501691DEBC736A4E57A88B2BC6463F151C7F6F9355862AB56E258B3B161DBB6663568B19D8C70B1D2CD9AE9ADA2F0907E8C01D3C388CC73A96E0DFFB75A1F0E168D932794D27811F6B59A7531C3BAF8D68C5CA763407C3602E466BD2155BF5D77CD0360F2BDBE60949B72DF09B72AEDE8CB9F1D0FAF40929831A8E9C292E69D06576E9751EF3C228DD3C6F1BE06E716BC6E86AC483DBB8D3DA82855E8FB45653A3B8296E414F141F1C7774E2E38C1D36154A21083D99F28E0A7823CFD10F86398D35C6C55627C06;
	  mmm_inst.ma_send_inp(lv_B, rr, lv_M);
	endrule

	rule rl_get_result;
	  let res<- mmm_inst.mav_get_result;
	  $display($time,"\t Result: %h", res);
	  $finish(0);
	endrule

  endmodule
endpackage
