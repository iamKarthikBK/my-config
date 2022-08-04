/******************************************************************************
 * File	Name			: ECC_SR.bsv
 * Package Module Name		: Elliptic Curve Cryptoprocessor for GF(2^233)
 * Author		    	: Vinod V Patwardhan
 * Type	of file			: BSV source code
 * Synopsis			: This file contains the module for scalar 
 * 				  multiplication on the curve
 *              	    	  y^2 + xy = x^3 + a.x^2 + b
 * 				  where a = 1
 ******************************************************************************/
package ECC_SR;

import ALU_SR::*;
import RegModule_SR::*;

typedef Bit#(233) Kbits;

interface ECC_IFC;
	method Action kVal(Kbits valueK);//Key Value 'k' is given as input to ECCP
	method Bit#(466) resultOut();//Returns Output 'kP', i.e X & Y coordinates of kP. 
	method Bit#(1) resultAck();//Return 1 when point multiplication is completed.
endinterface
  
typedef enum{Idle,KeyCheck,ScalarMul,Init,Finish,Zero} Cstate deriving (Eq,Bits);
/*
Idle	 : Initial state before firing of any rule.

KeyCheck : If key=0 then no Operations are performed and the state is changed to Zero
	   else State is changed to ScalarMul.

ScalarMul: Scalar Multiplication takes place when in this state.

Init	 : Dummy Scalar multiplications takes place until a leading 1 is encountered in the key.
      	   Once encountered, ECCP goes to Init state to load the curve constants Px, Py and b.

Finish	 : This state is entered when the Projective to Affine coordinate conversion takes place.

Zero	 : This state is entered when the Key=0.
*/
(*synthesize*)
module mkECC(ECC_IFC);

	RegBlk_IFC rg <- mkRegBlk();
	
	Reg#(Cstate) state <- mkReg(Idle);
	Reg#(Kbits) key <- mkReg (0);
	Reg#(UInt#(8)) currentBit <- mkReg(0);  //To indicate the position of leading '1' in the key.
	Reg#(UInt#(8)) precedingBit <- mkReg(0);      	//Used to check the previous bit value, so that we know where to read the results from.
					   	//(Double result or Addition result)
	
	Reg#(UInt#(8)) dummyOp <- mkReg(0); 	//To keep a count of how many times the ECCP should do dummy Double and Add before loading the 						    	actual values of elliptic curve.
	Reg#(UInt#(8)) numOfZeros <- mkReg(0);  //Stores the value of number of zeroes before leading '1' in the key.
	Reg#(Bit#(6)) cwCounter <- mkReg(0);	//To feed control word corresponding to the FSM state.
	Reg#(Bool) algoDone <- mkReg(False);	//To indicate the completion of point multiplication
	Reg#(Bit#(2)) initCounter <- mkReg(0);	//To initialise the register banks by feeding appropriate control words.
	Reg#(UInt#(8)) index <- mkReg(232);	//Used to debug, as to which key index is currently being processed. 
	Reg#(Bool) keyIsOne <- mkReg(False);	//Flag to indicate Key=1.

	Reg#(Bit#(43)) ctrl <- mkReg(0);	//To store the control word.


/*These control words are used when the preceding bit is 0. 
The Addition result are stored in RA1,RB1&BC1 (bank ABC), whereas Double results are stored in RD1,RD2,RD3 (bank D).
If the current bit is '0', the results to be used for further computations are of bank D, so we need to set control words accordingly.
*/
function Bit#(43) controlWord_rw(Bit#(6) cwSel);
case(cwSel)
//Double		       
6'd0: return 43'h5A443240209;//101 1010 0100 0100 0011 0010 0100 0000 0010 0000 1001 - 5A443240209
6'd1: return 43'h000083C0202;//000 0000 0000 0000 1000 0011 1100 0000 0010 0000 0010 - 000083C0202 
6'd2: return 43'h32829510324;//011 0010 1000 0010 1001 0101 0001 0000 0011 0010 0100 - 32829510324
6'd3: return 43'h06202B002C0;//000 0110 0010 0000 0010 1011 0000 0000 0010 1100 0000 - 06202B002C0

///Addition
6'd4: return 43'h00002280248;//000 0000 0000 0000 0010 0010 1000 0000 0010 0100 1000 - 00002280248
6'd5: return 43'h00024018082;//000 0000 0000 0010 0100 0000 0001 1000 0000 1000 0010 - 00024018082
6'd6: return 43'h00000240228;//000 0000 0000 0000 0000 0010 0100 0000 0010 0010 1000 - 00000240228
6'd7: return 43'h00000850211;//000 0000 0000 0000 0000 1000 0101 0000 0010 0001 0001 - 00000850211
6'd8: return 43'h00029510102;//000 0000 0000 0010 1001 0101 0001 0000 0001 0000 0010 - 00029510102
6'd9: return 43'h0004D34808A;//000 0000 0000 0100 1101 0011 0100 1000 0000 1000 1010 - 0004D34808A
6'd10: return 43'h0000628820B;//000 0000 0000 0000 0110 0010 1000 1000 0010 0000 1011 - 0000628820B
6'd11: return 43'h00002B00258;//000 0000 0000 0000 0010 1011 0000 0000 0010 0101 1000 - 00002B00258

//Inversion
6'd12: return 43'h4040100020D;//100 0000 0100 0000 0001 0000 0000 0000 0010 0000 1101 - 4040100020D
6'd13: return 43'h00000240206;//000 0000 0000 0000 0000 0010 0100 0000 0010 0000 0110 - 00000240206
6'd14: return 43'h00000240235;//000 0000 0000 0000 0000 0010 0100 0000 0010 0011 0101 - 00000240235
6'd15: return 43'h00081440E80;//000 0000 0000 1000 0001 0100 0100 0000 1110 1000 0000 - 00081440E80
6'd16: return 43'h00000640202;//000 0000 0000 0000 0000 0110 0100 0000 0010 0000 0010 - 00000640202
6'd17: return 43'h00000240235;//000 0000 0000 0000 0000 0010 0100 0000 0010 0011 0101 - 00000240235
6'd18: return 43'h00081441E80;//000 0000 0000 1000 0001 0100 0100 0001 1110 1000 0000 - 00081441E80
6'd19: return 43'h00000640202;//000 0000 0000 0000 0000 0110 0100 0000 0010 0000 0010 - 00000640202
6'd20: return 43'h00081443A80;//000 0000 0000 1000 0001 0100 0100 0011 1010 1000 0000 - 00081443A80
6'd21: return 43'h00000640202;//000 0000 0000 0000 0000 0110 0100 0000 0010 0000 0010 - 00000640202
6'd22: return 43'h00000240235;//000 0000 0000 0000 0000 0010 0100 0000 0010 0011 0101 - 00000240235
6'd23: return 43'h00081443A80;//000 0000 0000 1000 0001 0100 0100 0011 1010 1000 0000 - 00081443A80
6'd24: return 43'h00091403A80;//000 0000 0000 1001 0001 0100 0000 0011 1010 1000 0000 - 00091403A80
6'd25: return 43'h0000064023A;//000 0000 0000 0000 0000 0110 0100 0000 0010 0011 1010 - 0000064023A
6'd26: return 43'h00081443A80;//000 0000 0000 1000 0001 0100 0100 0011 1010 1000 0000 - 00081443A80
6'd27: return 43'h00091403A80;//000 0000 0000 1001 0001 0100 0000 0011 1010 1000 0000 - 00091403A80
6'd28: return 43'h00091403A80;//000 0000 0000 1001 0001 0100 0000 0011 1010 1000 0000 - 00091403A80
6'd29: return 43'h00091403A80;//000 0000 0000 1001 0001 0100 0000 0011 1010 1000 0000 - 00091403A80
6'd30: return 43'h00091400A80;//000 0000 0000 1001 0001 0100 0000 0000 1010 1000 0000 - 00091400A80
6'd31: return 43'h00000640202;//000 0000 0000 0000 0000 0110 0100 0000 0010 0000 0010 - 00000640202
6'd32: return 43'h00009100280;//000 0000 0000 0000 1001 0001 0000 0000 0010 1000 0000 - 00009100280
6'd33: return 43'h10000010200;//001 0000 0000 0000 0000 0000 0001 0000 0010 0000 0000 - 10000010200
6'd34: return 43'h10802200208;//001 0000 1000 0000 0010 0010 0000 0000 0010 0000 1000 - 10802200208
6'd35: return 43'h00000000280;//000 0000 0000 0000 0000 0000 0000 0000 0010 1000 0000 - 00000000280
default: return 43'h000000000;
endcase 
endfunction

/*These control words are used when the preceding bit is 1. 
The Addition result are stored in RA1,RB1&BC1 (bank ABC), whereas Double results are stored in RD1,RD2,RD3 (bank D).
If the current bit is '1', the results to be used for further computations are of bank ABC, so we need to set control words accordingly.
*/
function Bit#(43) controlWord_w(Bit#(6) cwSel);//write
case(cwSel)
//Double		       
6'd0: return 43'h0A441240209;//000 1010 0100 0100 0001 0010 0100 0000 0010 0000 1001 - 0A441240209
6'd1: return 43'h000083C0202;//000 0000 0000 0000 1000 0011 1100 0000 0010 0000 0010 - 000083C0202 
6'd2: return 43'h02829510324;//000 0010 1000 0010 1001 0101 0001 0000 0011 0010 0100 - 02829510324
6'd3: return 43'h06202B002C0;//000 0110 0010 0000 0010 1011 0000 0000 0010 1100 0000 - 06202B002C0

///Addition
6'd4: return 43'h00002280248;//000 0000 0000 0000 0010 0010 1000 0000 0010 0100 1000 - 00002280248
6'd5: return 43'h00024018082;//000 0000 0000 0010 0100 0000 0001 1000 0000 1000 0010 - 00024018082
6'd6: return 43'h00000240228;//000 0000 0000 0000 0000 0010 0100 0000 0010 0010 1000 - 00000240228
6'd7: return 43'h00000850211;//000 0000 0000 0000 0000 1000 0101 0000 0010 0001 0001 - 00000850211
6'd8: return 43'h00029510102;//000 0000 0000 0010 1001 0101 0001 0000 0001 0000 0010 - 00029510102
6'd9: return 43'h0004D34808A;//000 0000 0000 0100 1101 0011 0100 1000 0000 1000 1010 - 0004D34808A
6'd10: return 43'h0000628820B;//000 0000 0000 0000 0110 0010 1000 1000 0010 0000 1011 - 0000628820B
6'd11: return 43'h00002B00258;//000 0000 0000 0000 0010 1011 0000 0000 0010 0101 1000 - 00002B00258

//Inversion
6'd12: return 43'h0000100020D;//000 0000 0000 0000 0001 0000 0000 0000 0010 0000 1101 - 0000100020D
6'd13: return 43'h00000240206;//000 0000 0000 0000 0000 0010 0100 0000 0010 0000 0110 - 00000240206
6'd14: return 43'h00000240235;//000 0000 0000 0000 0000 0010 0100 0000 0010 0011 0101 - 00000240235
6'd15: return 43'h00081440E80;//000 0000 0000 1000 0001 0100 0100 0000 1110 1000 0000 - 00081440E80
6'd16: return 43'h00000640202;//000 0000 0000 0000 0000 0110 0100 0000 0010 0000 0010 - 00000640202
6'd17: return 43'h00000240235;//000 0000 0000 0000 0000 0010 0100 0000 0010 0011 0101 - 00000240235
6'd18: return 43'h00081441E80;//000 0000 0000 1000 0001 0100 0100 0001 1110 1000 0000 - 00081441E80
6'd19: return 43'h00000640202;//000 0000 0000 0000 0000 0110 0100 0000 0010 0000 0010 - 00000640202
6'd20: return 43'h00081443A80;//000 0000 0000 1000 0001 0100 0100 0011 1010 1000 0000 - 00081443A80
6'd21: return 43'h00000640202;//000 0000 0000 0000 0000 0110 0100 0000 0010 0000 0010 - 00000640202
6'd22: return 43'h00000240235;//000 0000 0000 0000 0000 0010 0100 0000 0010 0011 0101 - 00000240235
6'd23: return 43'h00081443A80;//000 0000 0000 1000 0001 0100 0100 0011 1010 1000 0000 - 00081443A80
6'd24: return 43'h00091403A80;//000 0000 0000 1001 0001 0100 0000 0011 1010 1000 0000 - 00091403A80
6'd25: return 43'h0000064023A;//000 0000 0000 0000 0000 0110 0100 0000 0010 0011 1010 - 0000064023A
6'd26: return 43'h00081443A80;//000 0000 0000 1000 0001 0100 0100 0011 1010 1000 0000 - 00081443A80
6'd27: return 43'h00091403A80;//000 0000 0000 1001 0001 0100 0000 0011 1010 1000 0000 - 00091403A80
6'd28: return 43'h00091403A80;//000 0000 0000 1001 0001 0100 0000 0011 1010 1000 0000 - 00091403A80
6'd29: return 43'h00091403A80;//000 0000 0000 1001 0001 0100 0000 0011 1010 1000 0000 - 00091403A80
6'd30: return 43'h00091400A80;//000 0000 0000 1001 0001 0100 0000 0000 1010 1000 0000 - 00091400A80
6'd31: return 43'h00000640202;//000 0000 0000 0000 0000 0110 0100 0000 0010 0000 0010 - 00000640202
6'd32: return 43'h00009100280;//000 0000 0000 0000 1001 0001 0000 0000 0010 1000 0000 - 00009100280
6'd33: return 43'h00000010200;//000 0000 0000 0000 0000 0000 0001 0000 0010 0000 0000 - 00000010200
6'd34: return 43'h00002200208;//000 0000 0000 0000 0010 0010 0000 0000 0010 0000 1000 - 00002200208
6'd35: return 43'h00000000280;//000 0000 0000 0000 0000 0000 0000 0000 0010 1000 0000 - 00000000280
default: return 43'h000000000;
endcase 
endfunction

//To check the Key and set varibles
rule chkKey (state == KeyCheck );
	if (numOfZeros==233) state <= Zero; 
	else 
	begin	
		if (numOfZeros==232) keyIsOne <= True;
		//$display("Number of Zeros:%d",numOfZeros);
		state <= ScalarMul;
		precedingBit <=  232 - numOfZeros;
		currentBit <=  231 - numOfZeros;
		dummyOp <= numOfZeros + 1;
		ctrl <= controlWord_w(0);
				
	end	
endrule

//Point multiplication according to Left to Right Algorithm.
rule algo (state == ScalarMul && !algoDone);
	//$display("Index:%d Dummy",index,dummyOp);

	//Reading the values from Register banks (assigned to 'out' here) and passing them to ALU unit.
	let out = rg.read(ctrl[42:14]); 

	//Perform operations on values read and producing results (assigned to 'auOut' here).
	let auOut = ffau(out[232:0],out[465:233],out[698:466],out[931:699],out[1164:932],{ctrl[13:0]});

	//Updating the Register banks with ALU outputs.
	rg.write(auOut[698:466],auOut[465:233],auOut[232:0],ctrl[42:14]);

	let regbank_dump = rg.contents();
	$display("\nRegBank dump:\nRA1 = %b\nRB1 = %b\nRC1 = %b\n",regbank_dump[698:466],regbank_dump[465:233],regbank_dump[232:0]);

//Perform dummy Double and Add until leading '1' is encountered.
if(dummyOp>1)
begin
	if (cwCounter==11)
		begin
		ctrl <= controlWord_w(0);
		cwCounter <= 0;
		dummyOp <= dummyOp - 1;
		index <= index - 1;
		end
	else 
		begin
		ctrl <= controlWord_w(cwCounter + 1);	
		cwCounter <= cwCounter + 1;
		end
end

//When leading '1' is encountered, the state is changed to load the Register banks with Curve constants.
else if(dummyOp==1)
begin
	state <= Init;
	dummyOp <= dummyOp - 1;
	index <= index - 1;
end


//Perform double and Add after actual curve constants are loaded in Register bank.
//The left to right algorithm starts from here.	
else
begin
	if (cwCounter==11 && currentBit == 0)
		begin
		if (key[currentBit]==0) ctrl <= controlWord_rw(12);	
		else ctrl <= controlWord_w(12);
		cwCounter <= 12;
		end
	else if (cwCounter==11 && currentBit != 0)
		begin
		if (key[currentBit]==0) ctrl <= controlWord_rw(0);	
		else ctrl <= controlWord_w(0);
		cwCounter <= 0;
		currentBit <= currentBit - 1;
		precedingBit <= precedingBit - 1;
		index <= index - 1;
		end
	else 
		begin
		if(cwCounter < 12)
		begin
			if (key[precedingBit]==0)ctrl <= controlWord_rw(cwCounter + 1);	
			else ctrl <= controlWord_w(cwCounter + 1);	
			cwCounter <= cwCounter + 1;
		end
		else 
		begin
			if (key[currentBit]==0)ctrl <= controlWord_rw(cwCounter + 1);	
			else ctrl <= controlWord_w(cwCounter + 1);	
			cwCounter <= cwCounter + 1;
		end		
		end
end


//When converion from Projective to Affine coordinates is completed, algoDone flag is set.
if(cwCounter==35 && (currentBit == 0 || keyIsOne))
begin
	algoDone <= True;
end

endrule

/* The following registers are set in rule init1:
RA1 = Px
RB1 = Py
RC1 = 1
RD1 = Px
*/
rule init1 (state == Init && initCounter==0);
	let cw = 43'h02141210000;
	rg.write(233'h0fac9dfcbac8313bb2139f1bb755fef65bc391f8b36f8f8eb7371fd558b,233'h1006a08a41903350678e58528bebf8a0beff867a7ca36716f7e01f81052,233'h0,cw[42:14]);
	initCounter <= 1;
endrule

/* The following registers are set in rule init2:
RA2 = Px
RB2 = Py
RD2 = Py
*/
rule init2 (state == Init && initCounter==1);
	let cw = 43'h06340234000;
	rg.write(233'h0fac9dfcbac8313bb2139f1bb755fef65bc391f8b36f8f8eb7371fd558b,233'h1006a08a41903350678e58528bebf8a0beff867a7ca36716f7e01f81052,233'h0,cw[42:14]);
	initCounter <= 2;
endrule

/* The following registers are set in rule init3:
RB4 = b
RD3 = 1
*/
rule init3 (state == Init && initCounter==2);
	let cw = 43'h0A540260000;
	rg.write(233'h0fac9dfcbac8313bb2139f1bb755fef65bc391f8b36f8f8eb7371fd558b,233'h066647ede6c332c7f8c0923bb58213b333b20e9ce4281fe115f7d8f90ad,233'h0,cw[42:14]);
	initCounter <= 3;
	if (numOfZeros==232) 
	begin	
		ctrl <= controlWord_w(12);
		cwCounter <= 12;
		state <= ScalarMul;
	end
	else 
	begin	
		ctrl <= controlWord_w(0);
		cwCounter <= 0;
		state <= ScalarMul;
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
	state <= KeyCheck;
	numOfZeros <= countZerosMSB(valueK);
endmethod

///Returns Output 'kP', i.e X & Y coordinates of kP.	
method Bit#(466) resultOut() if (algoDone);
	Bit#(1165) x;
	if(!keyIsOne)	
	x = rg.read(29'h00002000);	
	else 
	x = rg.read(29'h00002021);
	Bit#(466) result = {x[232:0],x[465:233]};//{A0=RA1, A1=RB1}. 
	return result;
endmethod 

//Return 1 when point multiplication is completed.
method Bit#(1) resultAck();
	if (algoDone) return 1;
	else return 0;
endmethod
endmodule

endpackage

