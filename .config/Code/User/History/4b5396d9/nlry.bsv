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
		$display("q = %b", rg_S[0]+rg_B[0]);
	  end
	  else begin
		lv_q <= rg_S[0];
		$display("q = %b", rg_S[0]);
	  end
	  rg_state<=1;
	endrule

	rule rl_init_add(rg_state==1);
	  if(rg_A[rg_iter]==1 && lv_q==0) begin
      if(counter<(fromInteger(valueOf(n)/valueOf(d)))) begin
        let lv_temp <- ba_mod.addn(rg_S[d_v*counter+d_v-1:d_v*counter], rg_B[d_v*counter+d_v-1:d_v*counter], rg_carry);
        out[counter] <= lv_temp[d_v-1:0];
		$display("out[%b] = %b", counter, lv_temp[d_v-1:0]);
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
	  $display("A: %h, B: %h, M: %h", a, b, m);
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
endpackage
