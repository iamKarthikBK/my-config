package TB;

import ECC::*;

module mktest(Empty);	
Reg#(Bit#(2)) s <- mkReg(0);
Reg #(Bit#(64)) cycles <- mkReg (0);	
ECC_IFC ep <- mkECC;

rule start(s==0);
$display("----------- Test Bench--------------");
//let k = 233'h10000000000000000000000000000000000000000000000000000000006;
let k = 233'b10110110111001010011110100001001000111010101110110000010010001111001000001011010101000011000111101111111010011001001001000010001110010001000011100110011001111100110010010000101010110111111010010011110001100010011001011111101110010111;
//let k = 233'h1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
ep.kVal(k);
s<=1;
endrule

rule ack (s==1);
	cycles <= cycles + 1;
	if(ep.resultAck()==1) s <= 2;
endrule

rule res(s==2);
let out = ep.resultOut();
$display("\nPx = %h", ep.resultOut()[465:233]);
$display("Py = %h", ep.resultOut()[232:0]);
$display("Cycles = %d\n", cycles);
$finish();
endrule
endmodule

endpackage
