package RegModule;


interface RegBlk_IFC;
	method Bit#(1165) read(Bit#(19) ctrl);
	method Action write(Bit#(233) c0,Bit#(233) c1,Bit#(233) qout,Bit#(19) ctrl);
	method Bit#(699) contents();
endinterface

(*synthesize*)
module mkRegBlk (RegBlk_IFC);

	//Bank A
	Reg#(Bit#(233)) ra1 <- mkReg(0);
	Reg#(Bit#(233)) ra2 <- mkReg(0);
	//Bank B
	Reg#(Bit#(233)) rb1 <- mkReg(0);
	Reg#(Bit#(233)) rb2 <- mkReg(0);
	Reg#(Bit#(233)) rb3 <- mkReg(0);
	Reg#(Bit#(233)) rb4 <- mkReg(0);
	//Bank C
	Reg#(Bit#(233)) rc1 <- mkReg(0);
	Reg#(Bit#(233)) rc2 <- mkReg(0);


method Action write(Bit#(233) c0,Bit#(233) c1,Bit#(233) qout,Bit#(19) ctrl);
Bit#(233) dinA,dinB,dinC ;

//.........Mux IN1.............
	dinA = ctrl[15] == 1? c1 : c0 ;
	//$display("dinA = %h",dinA);

//.........Mux IN2.............
	dinB = ctrl[16] == 1? c1 : c0 ;
	//$display("dinB = %h",dinB);

//.........Mux IN3.............
	case (ctrl[18:17])
		00:		dinC = c0;
		01:		dinC = qout;
		default:        dinC = 1;
	endcase
	//$display("dinC = %h",dinC);

	if (ctrl[2] == 1)//Write enable to bank A
	begin
		if(ctrl[0]==0) ra1 <= dinA;
		else ra2 <= dinA; 
	end

	if (ctrl[7] == 1)//Write enable to bank B
	begin
		/*case(ctrl[4:3])
			00: rb1 <= dinB;
			01: rb2 <= dinB;
			10: rb3 <= dinB;
			11: rb4 <= dinB;
		endcase*/
		if(ctrl[4:3]==2'b00) rb1 <= dinB;
		else if(ctrl[4:3]==2'b01) rb2 <= dinB;
		else if(ctrl[4:3]==2'b10) rb3 <= dinB;
		else rb4 <= dinB;
	end
	if (ctrl[10] == 1)//Write enable to bank C
	begin
		if(ctrl[8]==0) rc1 <= dinC;
		else rc2 <= dinC;
	end

endmethod

method Bit#(699) contents();
	return {ra1, rb1, rc1};
	// return {ra1,ra2,rb1,rb2,rb3,rb4,rc1,rc2};
endmethod 

method Bit#(1165) read(Bit#(19) ctrl);
Bit#(1165) outval = 0;
Bit#(233) a_out1,a_out2,b_out1,b_out2,c_out1,c_out2;

if (ctrl[0]==0) a_out1 = ra1;
else a_out1 = ra2; 
if (ctrl[1]==0) a_out2 = ra1;
else a_out2 = ra2; 

if(ctrl[4:3]==2'b00) b_out1 = rb1;
else if(ctrl[4:3]==2'b01) b_out1 = rb2;
else if(ctrl[4:3]==2'b10) b_out1 = rb3;
else b_out1 = rb4;

if(ctrl[6:5]==2'b00) b_out2 = rb1;
else if(ctrl[6:5]==2'b01) b_out2 = rb2;
else if(ctrl[6:5]==2'b10) b_out2 = rb3;
else b_out2 = rb4;

if (ctrl[8]==0) c_out1 = rc1;
else c_out1 = rc2; 
if (ctrl[9]==0) c_out2 = rc1;
else c_out2 = rc2;


//.........A0.............
	outval[232:0] = (ctrl[11] == 0) ? a_out1 : b_out2;          //Mux out1

//.........A1.............
	outval[465:233] = (ctrl[13] == 0) ? c_out1 : b_out2;        //Mux out3

//.........A2.............
	outval[698:466] = (ctrl[12] == 0) ? b_out1 : a_out2;        //Mux out2

//.........A3.............
	outval[931:699] = c_out2;

//.........Qin.............
	outval[1164:932] = (ctrl[14] == 0) ? outval[698:466] : outval[465:233];  //Mux out4

return outval;

endmethod

endmodule


/*module tbReg();          
              Reg#(int) state <-mkReg(0);
              RegBlk_IFC m <- mkRegBlk();

               rule step1(state == 0);
	             m.write( 1,2,3,19'h00484);
	             //m.write( 0,0,0,0);	
                    state <= 1 ;
               endrule 
 
               rule finish (state == 1);
			//$display("Out= %h", m.contents());
	               $display("a0= %h", m.read(0)[232:0]);
		       $display("a1= %h", m.read(0)[465:233]);
		       $display("a2= %h", m.read(0)[698:466]);
	               $display("a3= %h", m.read(0)[931:699]);
		       $display("qin= %h", m.read(0)[1164:932]);

	               $display("\nra1= %h", m.contents()[1863:1631]);
		       $display("ra2= %h", m.contents()[1630:1398]);
		       $display("\nrb1= %h", m.contents()[1397:1165]);
	               $display("rb2= %h", m.contents()[1164:932]);
		       $display("rb3= %h", m.contents()[931:699]);
	               $display("rb4= %h", m.contents()[698:466]);
		       $display("\nrc1= %h", m.contents()[465:233]);
		       $display("rc2= %h", m.contents()[232:0]);
		       $finish();
	       endrule 
endmodule*/
endpackage












