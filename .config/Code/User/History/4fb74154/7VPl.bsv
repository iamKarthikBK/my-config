package Tb;
module mkTb (Empty);
Ifc_type ifc <- mkModuleDeepThought;
rule theUltimateAnswer;
$display ("Hello World! The answer is: %0d", ifc.the_answer (10, 15, 17));
$finish (0);
endrule
endmodule: mkTb

interface Ifc_type;
method int the_answer (int x, int y, int z);
endinterface: Ifc_type
endpackage: Tb