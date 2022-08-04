/******************************************************************************
 * File	Name			: ECC.bsv
 * Package Module Name		: Elliptic Curve Cryptoprocessor for GF(2^233)
 * Author		    	: Vinod V Patwardhan
 * Type	of file			: BSV source code
 * Synopsis			: This file contains the module for scalar 
 * 				  multiplication on the curve
 *              	    	  y^2 + xy = x^3 + a.x^2 + b
 * 				  where a = 1
 ******************************************************************************/
package ECC;

import ALU::*;
import RegModule::*;

typedef Bit#(233) Kbits;

interface ECC_IFC;
	method Action kVal(Kbits valueK);//Key Value 'k' is given as input to ECCP
	method Bit#(466) resultOut();//Returns Output 'kP', i.e X & Y coordinates of kP.
	method Bit#(1) resultAck();//Return 1 when point multiplication is completed.
endinterface
  
typedef enum{Idle,FindMSB,Init,ScalarMul,Finish,Zero} Cstate deriving (Eq,Bits);
/*
Idle	 : Initial state before firing of any rule.

FindMSB  : If key=0 then no Operations are performed and the state is changed to Zero
	   else State is changed to ScalarMul.

ScalarMul: Scalar Multiplication takes place when in this state.

Finish	 : This state is entered when the Projective to Affine coordinate conversion takes place.

Zero	 : This state is entered when the Key=0.
*/
(*synthesize*)
module mkECC#(Bit#(64) cycles)(ECC_IFC);

	RegBlk_IFC rg <- mkRegBlk();
	
	Reg#(Cstate) state <- mkReg(Idle);
	Reg#(Kbits) key <- mkReg (0);		//To store the key value
	Reg#(UInt#(8)) k_2 <- mkReg(0);		//To indicate the first bit after leading '1' encountered
	Reg#(UInt#(8)) numOfZeros <- mkReg(0);  //Stores the value of number of zeroes before leading '1' in the key.
	Reg#(Bit#(6)) cwCounter <- mkReg(0);    //To feed control word corresponding to the FSM state.
	Reg#(Bit#(2)) initCounter <- mkReg(0);	//To initialise the register banks by feeding appropriate control words.

	Reg#(Bit#(33)) ctrl <- mkReg(0); //To store the control word.


//Control signals fed to ALU and RegModule
function Bit#(33) controlWord(Bit#(6) cwSel);
case(cwSel)
//Double		       
6'd0: return 33'h041240209;//0 0100 0001 0010 0100 0000 0010 0000 1001 - 041240209
6'd1: return 33'h0083C0202;//0 0000 1000 0011 1100 0000 0010 0000 0010 - 0083C0202 
6'd2: return 33'h029510324;//0 0010 1001 0101 0001 0000 0011 0010 0100 - 029510324
6'd3: return 33'h002B002C0;//0 0000 0010 1011 0000 0000 0010 1100 0000 - 002B002C0

///Addition
6'd4: return 33'h002280248;//0 0000 0010 0010 1000 0000 0010 0100 1000 - 002280248
6'd5: return 33'h024018082;//0 0010 0100 0000 0001 1000 0000 1000 0010 - 024018082
6'd6: return 33'h000240228;//0 0000 0000 0010 0100 0000 0010 0010 1000 - 000240228
6'd7: return 33'h000850211;//0 0000 0000 1000 0101 0000 0010 0001 0001 - 000850211
6'd8: return 33'h029510102;//0 0010 1001 0101 0001 0000 0001 0000 0010 - 029510102
6'd9: return 33'h04D34808A;//0 0100 1101 0011 0100 1000 0000 1000 1010 - 04D34808A
6'd10: return 33'h00628820B;//0 0000 0110 0010 1000 1000 0010 0000 1011 - 00628820B
6'd11: return 33'h002B00258;//0 0000 0010 1011 0000 0000 0010 0101 1000 - 002B00258

//Inversion
6'd12: return 33'h00100020D;//0 0000 0001 0000 0000 0000 0010 0000 1101 - 00100020D
6'd13: return 33'h000240206;//0 0000 0000 0010 0100 0000 0010 0000 0110 - 000240206
6'd14: return 33'h000240235;//0 0000 0000 0010 0100 0000 0010 0011 0101 - 000240235
6'd15: return 33'h081440E80;//0 1000 0001 0100 0100 0000 1110 1000 0000 - 081440E80
6'd16: return 33'h000640202;//0 0000 0000 0110 0100 0000 0010 0000 0010 - 000640202
6'd17: return 33'h000240235;//0 0000 0000 0010 0100 0000 0010 0011 0101 - 000240235
6'd18: return 33'h081441E80;//0 1000 0001 0100 0100 0001 1110 1000 0000 - 081441E80
6'd19: return 33'h000640202;//0 0000 0000 0110 0100 0000 0010 0000 0010 - 000640202
6'd20: return 33'h081443A80;//0 1000 0001 0100 0100 0011 1010 1000 0000 - 081443A80
6'd21: return 33'h000640202;//0 0000 0000 0110 0100 0000 0010 0000 0010 - 000640202
6'd22: return 33'h000240235;//0 0000 0000 0010 0100 0000 0010 0011 0101 - 000240235
6'd23: return 33'h081443A80;//0 1000 0001 0100 0100 0011 1010 1000 0000 - 081443A80
6'd24: return 33'h091403A80;//0 1001 0001 0100 0000 0011 1010 1000 0000 - 091403A80
6'd25: return 33'h00064023A;//0 0000 0000 0110 0100 0000 0010 0011 1010 - 00064023A
6'd26: return 33'h081443A80;//0 1000 0001 0100 0100 0011 1010 1000 0000 - 081443A80
6'd27: return 33'h091403A80;//0 1001 0001 0100 0000 0011 1010 1000 0000 - 091403A80
6'd28: return 33'h091403A80;//0 1001 0001 0100 0000 0011 1010 1000 0000 - 091403A80
6'd29: return 33'h091403A80;//0 1001 0001 0100 0000 0011 1010 1000 0000 - 091403A80
6'd30: return 33'h091400A80;//0 1001 0001 0100 0000 0000 1010 1000 0000 - 091400A80
6'd31: return 33'h000640202;//0 0000 0000 0110 0100 0000 0010 0000 0010 - 000640202
6'd32: return 33'h009100280;//0 0000 1001 0001 0000 0000 0010 1000 0000 - 009100280
6'd33: return 33'h000010200;//0 0000 0000 0000 0001 0000 0010 0000 0000 - 000010200
6'd34: return 33'h002200208;//0 0000 0010 0010 0000 0000 0010 0000 1000 - 002200208
6'd35: return 33'h000000280;//0 0000 0000 0000 0000 0000 0010 1000 0000 - 000000280
default: return 33'h000000000;
endcase 
endfunction

//To check the Key and set varibles
rule findMSB (state == FindMSB );
	$display("rule: findMSB: cycles: %d", cycles);
	if (numOfZeros==233) state <= Zero;  
	else if (numOfZeros==232) state <= Finish;
	else 
	begin	
		state <= Init;
		k_2 <=  231 - numOfZeros;		
	end	
endrule
rule init1 (state == Init && initCounter==0);
	$display("rule: init1: cycles: %d", cycles);
	let cw = 33'h141210000;
	rg.write(233'h0fac9dfcbac8313bb2139f1bb755fef65bc391f8b36f8f8eb7371fd558b,233'h1006a08a41903350678e58528bebf8a0beff867a7ca36716f7e01f81052,233'h0,cw[32:14]);
	initCounter <= 1;
endrule

/* The following registers are set in rule init2:
RA2 = Px
RB2 = Py
RD2 = Py
*/
rule init2 (state == Init && initCounter==1);
	$display("rule: init2: cycles: %d", cycles);
	let cw = 33'h140234000;
	rg.write(233'h0fac9dfcbac8313bb2139f1bb755fef65bc391f8b36f8f8eb7371fd558b,233'h1006a08a41903350678e58528bebf8a0beff867a7ca36716f7e01f81052,233'h0,cw[32:14]);
	initCounter <= 2;
endrule

/* The following registers are set in rule init3:
RB4 = b
RD3 = 1
*/
rule init3 (state == Init && initCounter==2);
	$display("rule: init3: cycles: %d", cycles);
	let cw = 33'h140260000;
	rg.write(233'h0fac9dfcbac8313bb2139f1bb755fef65bc391f8b36f8f8eb7371fd558b,233'h066647ede6c332c7f8c0923bb58213b333b20e9ce4281fe115f7d8f90ad,233'h0,cw[32:14]);
	initCounter <= 3;
	ctrl <= controlWord(0);
	cwCounter <= 0;
	state <= ScalarMul;
	
endrule

//Point multiplication according to Left to Right Algorithm.
rule algo (state == ScalarMul);
	$display("rule: algo: cwCounter: %d ~> cycles: %d", cwCounter, cycles);
	//Reading the values from Register banks (assigned to 'out' here) and passing them to ALU unit.
	let out = rg.read(ctrl[32:14]);

	//Perform operations on values read and producing results (assigned to 'auOut' here).
	let auOut = ffau(out[232:0],out[465:233],out[698:466],out[931:699],out[1164:932],{ctrl[13:0]});

	//Updating the Register banks with ALU outputs.
	rg.write(auOut[698:466],auOut[465:233],auOut[232:0],ctrl[32:14]);
	
	
	if(cwCounter==3 && key[k_2]==0 && k_2 != 0)
		begin
		ctrl <= controlWord(0);
		cwCounter <= 0;
		k_2 <= k_2 - 1;
		end
	else if ((cwCounter==3 || cwCounter==11) && key[k_2]==0 && k_2 == 0)
		begin
		ctrl <= controlWord(12);
		cwCounter <= 12;
		end
	else if (cwCounter==11 && k_2 != 0)
		begin
		ctrl <= controlWord(0);
		cwCounter <= 0;
		k_2 <= k_2 - 1;
		end
	else 
		begin
		ctrl <= controlWord(cwCounter + 1);	
		cwCounter <= cwCounter + 1;
		end

	//When converion from Projective to Affine coordinates is completed, algoDone flag is set.	
	if(cwCounter==35 && k_2 == 0) 
	begin
		state <= Finish;
	end
endrule

//This rule is executed when Key=0
rule zeroKey (state ==Zero);
	$display("Key = 0");
	$finish();
endrule

//Method to feed in Key value to ECCP
method Action kVal(Kbits valueK) if (state == Idle);
	key <= valueK;
	state <= FindMSB;
	numOfZeros <= countZerosMSB(valueK);
endmethod

///Returns Output 'kP', i.e X & Y coordinates of kP.	
method Bit#(466) resultOut() if (state == Finish);
	Bit#(466) result;	
		let x = rg.contents();
		result = {x[1863:1631],x[1397:1165]};
	return result;
endmethod 

//Return 1 when point multiplication is completed.
method Bit#(1) resultAck();
	if (state == Finish) return 1;
	else return 0;
endmethod
endmodule

endpackage

