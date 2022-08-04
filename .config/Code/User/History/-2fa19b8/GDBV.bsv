/******************************************************************************
 * File	Name			: RegModule.bsv
 * Package Module Name		: Elliptic Curve Cryptoprocessor for GF(2^233)
 * Author		    	: Vinod V Patwardhan
 * Type	of file			: BSV source code
 * Synopsis			: This file contains the module for Register bank of the
 * 				  elliptic curve processor for the curve
 *              		  y^2 + xy = x^3 + a.x^2 + b
 * 				  where a = 1
 ******************************************************************************/
package RegModule_SR;


interface RegBlk_IFC;
	method Bit#(1165) read(Bit#(29) ctrl);//Output of Register module, which are inputs to ALU module.
	method Action write(Bit#(233) c0,Bit#(233) c1,Bit#(233) qout,Bit#(29) ctrl);//Inputs of ALU are written in the Register banks.
	method Bit#(699) contents();//To get the contents of the banks at any given point of time, I used this for debugging.
endinterface


/*This is implemented acccording to Fig 7.6 of Chester's Thesis with some modifications as below:
1. Mux In4 shown in fig is 3:1, so added a dummy input to make it 4:1.
2. The select lines aren't given to Mux In4, so added two select lines ctrl[25] and ctrl[24]. */

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

	//Bank D
	Reg#(Bit#(233)) rd1 <- mkReg(0);
	Reg#(Bit#(233)) rd2 <- mkReg(0);
	Reg#(Bit#(233)) rd3 <- mkReg(0);



method Action write(Bit#(233) c0,Bit#(233) c1,Bit#(233) qout,Bit#(29) ctrl);
Bit#(233) dinA,dinB,dinC,dinD;

//.........Mux IN1.............
	dinA = ctrl[15] == 1? c1 : c0 ;

//.........Mux IN2.............
	dinB = ctrl[16] == 1? c1 : c0 ;

//.........Mux IN3.............
	case (ctrl[18:17])
		00:		dinC = c0;
		01:		dinC = qout;
		default:        dinC = 1;
	endcase

//.........Mux IN4.............
	if(ctrl[25:24]==2'b00) dinD = dinA;
	else if(ctrl[25:24]==2'b01) dinD = dinB;
	else if(ctrl[25:24]==2'b10) dinD = dinC;
	else dinD = 0; //Dummy input added

//If I use case statement, not sure why BSC compiler gives error stating '10' is not a 2 bit literal
	/*case (ctrl[25:24])		 
		00:		dinD = dinA;
		01:		dinD = dinB;
		10:        	dinD = dinC;
		default:	dinD = 0;
	endcase*/

	if (ctrl[2] == 1)//Write enable to bank A
	begin
		if(ctrl[0]==0) ra1 <= dinA;
		else ra2 <= dinA; 
	end

	if (ctrl[7] == 1)//Write enable to bank B
	begin
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

	if (ctrl[23] == 1)//Write enable to bank D
	begin
		if(ctrl[20:19]==2'b00) rd1 <= dinD;
		else if(ctrl[20:19]==2'b01) rd2 <= dinD;
		else rd3 <= dinD;
	end
endmethod


//To get the contents of the banks at any given point of time, I used this for debugging.
method Bit#(699) contents();
	// return {ra1,ra2,rb1,rb2,rb3,rb4,rc1,rc2,rd1,rd2,rd3};
	return {ra1, rb1, rc1};
endmethod


method Bit#(1165) read(Bit#(29) ctrl);
Bit#(1165) outval = 0;
Bit#(233) a_out1,a_out2,b_out1,b_out2,c_out1,c_out2,d_out1,d_out2;

//Bank A
if (ctrl[0]==0) a_out1 = ra1;
else a_out1 = ra2; 
if (ctrl[1]==0) a_out2 = ra1;
else a_out2 = ra2; 

//Bank B
if(ctrl[4:3]==2'b00) b_out1 = rb1;
else if(ctrl[4:3]==2'b01) b_out1 = rb2;
else if(ctrl[4:3]==2'b10) b_out1 = rb3;
else b_out1 = rb4;

if(ctrl[6:5]==2'b00) b_out2 = rb1;
else if(ctrl[6:5]==2'b01) b_out2 = rb2;
else if(ctrl[6:5]==2'b10) b_out2 = rb3;
else b_out2 = rb4;

//Bank C
if (ctrl[8]==0) c_out1 = rc1;
else c_out1 = rc2; 
if (ctrl[9]==0) c_out2 = rc1;
else c_out2 = rc2;

//Bank D
if(ctrl[20:19]==2'b00) d_out1 = rd1;
else if(ctrl[20:19]==2'b01) d_out1 = rd2;
else if(ctrl[20:19]==2'b10) d_out1 = rd3;
else d_out1 = 0;

if(ctrl[22:21]==2'b00) d_out2 = rd1;
else if(ctrl[22:21]==2'b01) d_out2 = rd2;
else if(ctrl[22:21]==2'b10) d_out2 = rd3;
else d_out2 = 0;

//.........A0.............
        //Mux out1
	if({ctrl[26],ctrl[11]}==2'b00) outval[232:0] = a_out1;
	else if({ctrl[26],ctrl[11]}==2'b01) outval[232:0] = b_out2;
	else if({ctrl[26],ctrl[11]}==2'b10) outval[232:0] = d_out1;
	else outval[232:0] = d_out2;

//.........A1.............
        //Mux out3
	if({ctrl[28],ctrl[13]}==2'b00) outval[465:233] = c_out1;
	else if({ctrl[28],ctrl[13]}==2'b01) outval[465:233] = b_out2;
	else if({ctrl[28],ctrl[13]}==2'b10) outval[465:233] = d_out1;
	else outval[465:233] = 0;

//.........A2.............
	//Mux out2
	if({ctrl[27],ctrl[12]}==2'b00) outval[698:466] = b_out1;
	else if({ctrl[27],ctrl[12]}==2'b01) outval[698:466] = a_out2;
	else if({ctrl[27],ctrl[12]}==2'b10) outval[698:466] = d_out2;
	else outval[698:466] = 0;

//.........A3.............
	outval[931:699] = c_out2;

//.........Qin.............
	outval[1164:932] = (ctrl[14] == 0) ? outval[698:466] : outval[465:233];  //Mux out4

return outval;

endmethod

endmodule


/*Uncomment the below code if you want to test the Register module and setting top module accordingly in Makefile*/
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












