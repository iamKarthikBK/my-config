package kmul;

`include "ecc_accel_params.defines"
import UniqueWrappers::*;

/*	function to autometically adjust the input to output width, similar to "zeroExtend()".	*/
function Bit#(y) fn_adjust(Bit#(x) inp);
    Bit#(TAdd#(x,y)) lv= zeroExtend(inp);
    return truncate(lv);
endfunction : fn_adjust


/*	hybrid karatsuba multiplier */
function Bit#(m) fn_kmul(Bit#(n) a, Bit#(n) b)	
	provisos( 	Add#(1, m, TMul#(2, n)),	// relationship between "m" & "n". i.e. output and input size respectively
				Div#(n,2,n_by_2)
			);

	Bit#(m) ans = ?;

	if(valueOf(n)<29)begin 						// BASE CASE, if size of input<29 then call gkmul
		ans = fn_gkmul(a,b);
	end	
	else begin									// else proceed with simple karatsuba multilication algorithm.
		Integer sz = valueOf(n); 						// sz = size of input operand
		Integer l = valueOf(n_by_2);					// l = ceil(sz/2)

		Bit#(TDiv#(n,2)) aDash, bDash;								
				
		// aDash=ah+al;   bDash=bh+bl;	here "+" operation is the addition of two elements of a finite field (using XOR) 
		if(valueOf(n)%2 == 0)begin					// n is even		
			aDash = a[valueOf(n)-1:l] ^ a[l-1:0];    				
			bDash = b[valueOf(n)-1:l] ^ b[l-1:0];	
		end
		else begin									// n is odd
			aDash = a[valueOf(n)-1:l] ^ a[l-2:0];       
			aDash[l-1] = a[l-1];
			bDash = b[valueOf(n)-1:l] ^ b[l-2:0];		
			bDash[l-1] = b[l-1];
		end
		
		// splitting a into ah (i.e. a-high) and al (i.e. a-low)		
		Bit#(TDiv#(n,2)) 			al = a[l-1:0];				// sizeof(al) = ceil(n/2)
		Bit#(TSub#(n,TDiv#(n,2))) 	ah = a[valueOf(n)-1:l];		// sizeof(ah) = n - sizeOf(al)
		
		//splitting b into bh and bl
		Bit#(TDiv#(n,2)) 			bl = b[l-1:0];				// sizeof(al) = ceil(n/2)
		Bit#(TSub#(n,TDiv#(n,2))) 	bh = b[valueOf(n)-1:l];		// sizeof(ah) = n - sizeOf(al)
		
		//smaller multiplications (recursive calls)
		Bit#(TSub#(TMul#(2, TDiv#(n,2)), 1))			cp1 	= fn_kmul(al, bl); 				// low mul
		Bit#(TSub#(TMul#(2, TDiv#(n,2)), 1))			cp2 	= fn_kmul(aDash, bDash);			// center mul
		Bit#(TSub#(TMul#(2,TSub#(n,TDiv#(n,2))), 1))	cp3 	= fn_kmul(ah, bh);				// high mul

		// adjusting the output of the multiplications to output size
		Bit#(m) cP1= fn_adjust(cp1);
		Bit#(m) cP2= fn_adjust(cp2);
		Bit#(m) cP3= fn_adjust(cp3);
		
		//final shifting and addition (using XOR operation)
		ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1; 		
	end
	
	return ans;
endfunction: fn_kmul

interface Ifc_kmul;
	method ActionValue#(Bit#(`DoubleKeySize)) mul(Bit#(`KeySize) a, Bit#(`KeySize) b); 
endinterface

(*synthesize*)
module mk_kmul(Ifc_kmul);
	Wrapper2#(Bit#(`KeySize), Bit#(`KeySize), Bit#(`DoubleKeySize)) kmul <- mkUniqueWrapper2(fn_kmul);
	method ActionValue#(Bit#(`DoubleKeySize)) mul(Bit#(`KeySize) a, Bit#(`KeySize) b); 
		let ans <- kmul.func(a, b);
		return ans;
	endmethod
endmodule

//-------------------------- utility functions -----------------

function Bit#(1) mxy(Bit#(n)a, Bit#(n)b, Integer i, Integer j);
	Bit#(1) ans = (a[i] ^ a[j]) & (b[i] ^ b[j]);
	return ans;
endfunction

function Bit#(1) mx(Bit#(n)a, Bit#(n)b, Integer i);
	Bit#(1) ans = a[i] & b[i];
	return ans;
endfunction

function Bit#(m) fn_gkmul(Bit#(n) a, Bit#(n) b)
	provisos( Mul#(2, n, t1), Add#(m , 1, t1));   // 2*n-1 = m; 
	Bit#(m)c = 0;
	Integer m = valueOf(n);
	
	for(Integer i=0; i<=m-2; i=i+1)begin
		c[i] = 1'b0;
		c[2*m-2-i] = 1'b0;
		for(Integer j=0; j<=i/2; j=j+1)begin
			if(i == 2*j)begin
				c[i] = c[i] ^ mx(a,b,j);
				c[2*m-2-i] = c[2*m-2-i] ^ mx(a,b,m-1-j);
			end
			else begin
				c[i] = c[i] ^ mx(a,b,j) ^ mx(a,b,i-j) ^ mxy(a,b,j,i-j);
				c[2*m-2-i] = c[2*m-2-i] ^ mx(a,b,m-1-j) ^ mx(a,b,m-1-i+j) ^ mxy(a,b,m-1-j, m-1-i+j);
			end
		end
	end
	for(Integer j=0; j<=(m-1)/2; j=j+1)begin
		if(m-1 == 2*j)begin
			c[m-1] = c[m-1] ^ mx(a,b,j);
		end
		else begin
			c[m-1] = c[m-1] ^ mx(a,b,j) ^ mx(a,b,m-1-j) ^ mxy(a,b,j, m-1-j);
		end
	end
	return c;
endfunction: fn_gkmul

// /*doc:interface:interface that enables the BVI wrapper to communicate with other BSV modules*/
// interface Ifc_kmul;

//     (*always_ready , always_enabled*)
//     method Action ma_start(Bit#(`KeySize) a, Bit#(`KeySize) b);

//     (*always_enabled*)
//     method Bit#(`DoubleKeySize) mv_result ();


// endinterface: Ifc_kmul

// /*doc:module: imports the verilog for karatsuba multiplier*/
// import "BVI" ks283 =
// module mk_kmul(Ifc_kmul);

//     method ma_start    (a, b)   enable((*inhigh*) some_name);
//     method d mv_result   ();

//     default_clock clk();
//     default_reset rstn();

//     path (a, d);
//     path (b, d);

//     schedule (ma_start)     SB  (mv_result);
//     schedule (mv_result)    CF  (mv_result);
//     schedule (ma_start)     CF  (ma_start);


// endmodule: mk_kmul

/* This is an auto generated Bluespec SystemVerilog code for 283-bit finite field hybrid karatsuba multiplier
* Code By			 : Saurabh Singh
* Design Proposed by : Chester Rebeiro
*/

// //----------------- HKMUL283-------------------
// function Bit#(565) hkmul283(Bit#(283) a, Bit#(283) b);
// 	Integer n = 283;  Integer l = 142;
// 	Bit#(l) aDash = a[n-1:l] ^ a[l-2:0]; aDash[l-1] = a[l-1];
// 	Bit#(l)	bDash = b[n-1:l] ^ b[l-2:0]; bDash[l-1] = b[l-1];
// 	Bit#(283) cp1 = hkmul142(a[l-1:0], b[l-1:0]);
// 	Bit#(283) cp2 = hkmul142(aDash, bDash);
// 	Bit#(281) cp3 = hkmul141(a[n-1:l], b[n-1:l]);
// 	Bit#(565) cP1 = zeroExtend(cp1);
// 	Bit#(565) cP2 = zeroExtend(cp2);
// 	Bit#(565) cP3 = zeroExtend(cp3);
// 	Bit#(565) ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1;
// 	return ans;
// endfunction

// //----------------- HKMUL142-------------------
// function Bit#(283) hkmul142(Bit#(142) a, Bit#(142) b);
// 	Integer n = 142;  Integer l = 71;
// 	Bit#(l)	aDash = a[n-1:l] ^ a[l-1:0];
// 	Bit#(l)	bDash = b[n-1:l] ^ b[l-1:0];
// 	Bit#(141) cp1 = hkmul71(a[l-1:0], b[l-1:0]);
// 	Bit#(141) cp2 = hkmul71(aDash, bDash);
// 	Bit#(141) cp3 = hkmul71(a[n-1:l], b[n-1:l]);
// 	Bit#(283) cP1 = zeroExtend(cp1);
// 	Bit#(283) cP2 = zeroExtend(cp2);
// 	Bit#(283) cP3 = zeroExtend(cp3);
// 	Bit#(283) ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1;
// 	return ans;
// endfunction

// //----------------- HKMUL141-------------------
// function Bit#(281) hkmul141(Bit#(141) a, Bit#(141) b);
// 	Integer n = 141;  Integer l = 71;
// 	Bit#(l) aDash = a[n-1:l] ^ a[l-2:0]; aDash[l-1] = a[l-1];
// 	Bit#(l)	bDash = b[n-1:l] ^ b[l-2:0]; bDash[l-1] = b[l-1];
// 	Bit#(141) cp1 = hkmul71(a[l-1:0], b[l-1:0]);
// 	Bit#(141) cp2 = hkmul71(aDash, bDash);
// 	Bit#(139) cp3 = hkmul70(a[n-1:l], b[n-1:l]);
// 	Bit#(281) cP1 = zeroExtend(cp1);
// 	Bit#(281) cP2 = zeroExtend(cp2);
// 	Bit#(281) cP3 = zeroExtend(cp3);
// 	Bit#(281) ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1;
// 	return ans;
// endfunction

// //----------------- HKMUL71-------------------
// function Bit#(141) hkmul71(Bit#(71) a, Bit#(71) b);
// 	Integer n = 71;  Integer l = 36;
// 	Bit#(l) aDash = a[n-1:l] ^ a[l-2:0]; aDash[l-1] = a[l-1];
// 	Bit#(l)	bDash = b[n-1:l] ^ b[l-2:0]; bDash[l-1] = b[l-1];
// 	Bit#(71) cp1 = hkmul36(a[l-1:0], b[l-1:0]);
// 	Bit#(71) cp2 = hkmul36(aDash, bDash);
// 	Bit#(69) cp3 = hkmul35(a[n-1:l], b[n-1:l]);
// 	Bit#(141) cP1 = zeroExtend(cp1);
// 	Bit#(141) cP2 = zeroExtend(cp2);
// 	Bit#(141) cP3 = zeroExtend(cp3);
// 	Bit#(141) ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1;
// 	return ans;
// endfunction

// //----------------- HKMUL70-------------------
// function Bit#(139) hkmul70(Bit#(70) a, Bit#(70) b);
// 	Integer n = 70;  Integer l = 35;
// 	Bit#(l)	aDash = a[n-1:l] ^ a[l-1:0];
// 	Bit#(l)	bDash = b[n-1:l] ^ b[l-1:0];
// 	Bit#(69) cp1 = hkmul35(a[l-1:0], b[l-1:0]);
// 	Bit#(69) cp2 = hkmul35(aDash, bDash);
// 	Bit#(69) cp3 = hkmul35(a[n-1:l], b[n-1:l]);
// 	Bit#(139) cP1 = zeroExtend(cp1);
// 	Bit#(139) cP2 = zeroExtend(cp2);
// 	Bit#(139) cP3 = zeroExtend(cp3);
// 	Bit#(139) ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1;
// 	return ans;
// endfunction

// //----------------- HKMUL36-------------------
// function Bit#(71) hkmul36(Bit#(36) a, Bit#(36) b);
// 	Integer n = 36;  Integer l = 18;
// 	Bit#(l)	aDash = a[n-1:l] ^ a[l-1:0];
// 	Bit#(l)	bDash = b[n-1:l] ^ b[l-1:0];
// 	Bit#(35) cp1 = gkmul18(a[l-1:0], b[l-1:0]);
// 	Bit#(35) cp2 = gkmul18(aDash, bDash);
// 	Bit#(35) cp3 = gkmul18(a[n-1:l], b[n-1:l]);
// 	Bit#(71) cP1 = zeroExtend(cp1);
// 	Bit#(71) cP2 = zeroExtend(cp2);
// 	Bit#(71) cP3 = zeroExtend(cp3);
// 	Bit#(71) ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1;
// 	return ans;
// endfunction

// //----------------- HKMUL35-------------------
// function Bit#(69) hkmul35(Bit#(35) a, Bit#(35) b);
// 	Integer n = 35;  Integer l = 18;
// 	Bit#(l) aDash = a[n-1:l] ^ a[l-2:0]; aDash[l-1] = a[l-1];
// 	Bit#(l)	bDash = b[n-1:l] ^ b[l-2:0]; bDash[l-1] = b[l-1];
// 	Bit#(35) cp1 = gkmul18(a[l-1:0], b[l-1:0]);
// 	Bit#(35) cp2 = gkmul18(aDash, bDash);
// 	Bit#(33) cp3 = gkmul17(a[n-1:l], b[n-1:l]);
// 	Bit#(69) cP1 = zeroExtend(cp1);
// 	Bit#(69) cP2 = zeroExtend(cp2);
// 	Bit#(69) cP3 = zeroExtend(cp3);
// 	Bit#(69) ans = ( cP3<<(2*l) ) ^ ( (cP1 ^ cP2 ^ cP3)<<l ) ^ cP1;
// 	return ans;
// endfunction

// //---------------- GKMUL18---------------
// function Bit#(35) gkmul18(Bit#(18) a, Bit#(18) b);
// 	Bit#(18) n;
// 	for(Integer i=0; i<18; i=i+1)begin
// 		n[i] = a[i] & b[i];
// 	end
// 	Bit#(18) m[18];
// 	for(Integer i=0; i<18; i=i+1)begin
// 		for(Integer j=i+1; j<18; j=j+1)begin
// 			m[i][j] = (a[i] ^ a[j]) & (b[i] ^ b[j]);
// 		end
// 	end
// 	Bit#(35) d;
// 	d[0] = n[0];
// 	d[1] = m[0][1] ^ n[0] ^ n[1];
// 	d[2] = m[0][2] ^ n[0] ^ n[1] ^ n[2];
// 	d[3] = m[0][3] ^ m[1][2] ^ n[0] ^ n[1] ^ n[2] ^ n[3];
// 	d[4] = m[0][4] ^ m[1][3] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4];
// 	d[5] = m[0][5] ^ m[1][4] ^ m[2][3] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5];
// 	d[6] = m[0][6] ^ m[1][5] ^ m[2][4] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6];
// 	d[7] = m[0][7] ^ m[1][6] ^ m[2][5] ^ m[3][4] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7];
// 	d[8] = m[0][8] ^ m[1][7] ^ m[2][6] ^ m[3][5] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8];
// 	d[9] = m[0][9] ^ m[1][8] ^ m[2][7] ^ m[3][6] ^ m[4][5] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9];
// 	d[10] = m[0][10] ^ m[1][9] ^ m[2][8] ^ m[3][7] ^ m[4][6] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10];
// 	d[11] = m[0][11] ^ m[1][10] ^ m[2][9] ^ m[3][8] ^ m[4][7] ^ m[5][6] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11];
// 	d[12] = m[0][12] ^ m[1][11] ^ m[2][10] ^ m[3][9] ^ m[4][8] ^ m[5][7] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12];
// 	d[13] = m[0][13] ^ m[1][12] ^ m[2][11] ^ m[3][10] ^ m[4][9] ^ m[5][8] ^ m[6][7] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13];
// 	d[14] = m[0][14] ^ m[1][13] ^ m[2][12] ^ m[3][11] ^ m[4][10] ^ m[5][9] ^ m[6][8] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14];
// 	d[15] = m[0][15] ^ m[1][14] ^ m[2][13] ^ m[3][12] ^ m[4][11] ^ m[5][10] ^ m[6][9] ^ m[7][8] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15];
// 	d[16] = m[0][16] ^ m[1][15] ^ m[2][14] ^ m[3][13] ^ m[4][12] ^ m[5][11] ^ m[6][10] ^ m[7][9] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[17] = m[0][17] ^ m[1][16] ^ m[2][15] ^ m[3][14] ^ m[4][13] ^ m[5][12] ^ m[6][11] ^ m[7][10] ^ m[8][9] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[18] = m[1][17] ^ m[2][16] ^ m[3][15] ^ m[4][14] ^ m[5][13] ^ m[6][12] ^ m[7][11] ^ m[8][10] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[19] = m[2][17] ^ m[3][16] ^ m[4][15] ^ m[5][14] ^ m[6][13] ^ m[7][12] ^ m[8][11] ^ m[9][10] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[20] = m[3][17] ^ m[4][16] ^ m[5][15] ^ m[6][14] ^ m[7][13] ^ m[8][12] ^ m[9][11] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[21] = m[4][17] ^ m[5][16] ^ m[6][15] ^ m[7][14] ^ m[8][13] ^ m[9][12] ^ m[10][11] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[22] = m[5][17] ^ m[6][16] ^ m[7][15] ^ m[8][14] ^ m[9][13] ^ m[10][12] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[23] = m[6][17] ^ m[7][16] ^ m[8][15] ^ m[9][14] ^ m[10][13] ^ m[11][12] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[24] = m[7][17] ^ m[8][16] ^ m[9][15] ^ m[10][14] ^ m[11][13] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[25] = m[8][17] ^ m[9][16] ^ m[10][15] ^ m[11][14] ^ m[12][13] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[26] = m[9][17] ^ m[10][16] ^ m[11][15] ^ m[12][14] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[27] = m[10][17] ^ m[11][16] ^ m[12][15] ^ m[13][14] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[28] = m[11][17] ^ m[12][16] ^ m[13][15] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[29] = m[12][17] ^ m[13][16] ^ m[14][15] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[30] = m[13][17] ^ m[14][16] ^ n[13] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[31] = m[14][17] ^ m[15][16] ^ n[14] ^ n[15] ^ n[16] ^ n[17];
// 	d[32] = m[15][17] ^ n[15] ^ n[16] ^ n[17];
// 	d[33] = m[16][17] ^ n[16] ^ n[17];
// 	d[34] = n[17];
// 	return d;
// endfunction

// //---------------- GKMUL17---------------
// function Bit#(33) gkmul17(Bit#(17) a, Bit#(17) b);
// 	Bit#(17) n;
// 	for(Integer i=0; i<17; i=i+1)begin
// 		n[i] = a[i] & b[i];
// 	end
// 	Bit#(17) m[17];
// 	for(Integer i=0; i<17; i=i+1)begin
// 		for(Integer j=i+1; j<17; j=j+1)begin
// 			m[i][j] = (a[i] ^ a[j]) & (b[i] ^ b[j]);
// 		end
// 	end
// 	Bit#(33) d;
// 	d[0] = n[0];
// 	d[1] = m[0][1] ^ n[0] ^ n[1];
// 	d[2] = m[0][2] ^ n[0] ^ n[1] ^ n[2];
// 	d[3] = m[0][3] ^ m[1][2] ^ n[0] ^ n[1] ^ n[2] ^ n[3];
// 	d[4] = m[0][4] ^ m[1][3] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4];
// 	d[5] = m[0][5] ^ m[1][4] ^ m[2][3] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5];
// 	d[6] = m[0][6] ^ m[1][5] ^ m[2][4] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6];
// 	d[7] = m[0][7] ^ m[1][6] ^ m[2][5] ^ m[3][4] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7];
// 	d[8] = m[0][8] ^ m[1][7] ^ m[2][6] ^ m[3][5] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8];
// 	d[9] = m[0][9] ^ m[1][8] ^ m[2][7] ^ m[3][6] ^ m[4][5] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9];
// 	d[10] = m[0][10] ^ m[1][9] ^ m[2][8] ^ m[3][7] ^ m[4][6] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10];
// 	d[11] = m[0][11] ^ m[1][10] ^ m[2][9] ^ m[3][8] ^ m[4][7] ^ m[5][6] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11];
// 	d[12] = m[0][12] ^ m[1][11] ^ m[2][10] ^ m[3][9] ^ m[4][8] ^ m[5][7] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12];
// 	d[13] = m[0][13] ^ m[1][12] ^ m[2][11] ^ m[3][10] ^ m[4][9] ^ m[5][8] ^ m[6][7] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13];
// 	d[14] = m[0][14] ^ m[1][13] ^ m[2][12] ^ m[3][11] ^ m[4][10] ^ m[5][9] ^ m[6][8] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14];
// 	d[15] = m[0][15] ^ m[1][14] ^ m[2][13] ^ m[3][12] ^ m[4][11] ^ m[5][10] ^ m[6][9] ^ m[7][8] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15];
// 	d[16] = m[0][16] ^ m[1][15] ^ m[2][14] ^ m[3][13] ^ m[4][12] ^ m[5][11] ^ m[6][10] ^ m[7][9] ^ n[0] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[17] = m[1][16] ^ m[2][15] ^ m[3][14] ^ m[4][13] ^ m[5][12] ^ m[6][11] ^ m[7][10] ^ m[8][9] ^ n[1] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[18] = m[2][16] ^ m[3][15] ^ m[4][14] ^ m[5][13] ^ m[6][12] ^ m[7][11] ^ m[8][10] ^ n[2] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[19] = m[3][16] ^ m[4][15] ^ m[5][14] ^ m[6][13] ^ m[7][12] ^ m[8][11] ^ m[9][10] ^ n[3] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[20] = m[4][16] ^ m[5][15] ^ m[6][14] ^ m[7][13] ^ m[8][12] ^ m[9][11] ^ n[4] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[21] = m[5][16] ^ m[6][15] ^ m[7][14] ^ m[8][13] ^ m[9][12] ^ m[10][11] ^ n[5] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[22] = m[6][16] ^ m[7][15] ^ m[8][14] ^ m[9][13] ^ m[10][12] ^ n[6] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[23] = m[7][16] ^ m[8][15] ^ m[9][14] ^ m[10][13] ^ m[11][12] ^ n[7] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[24] = m[8][16] ^ m[9][15] ^ m[10][14] ^ m[11][13] ^ n[8] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[25] = m[9][16] ^ m[10][15] ^ m[11][14] ^ m[12][13] ^ n[9] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[26] = m[10][16] ^ m[11][15] ^ m[12][14] ^ n[10] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[27] = m[11][16] ^ m[12][15] ^ m[13][14] ^ n[11] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[28] = m[12][16] ^ m[13][15] ^ n[12] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[29] = m[13][16] ^ m[14][15] ^ n[13] ^ n[14] ^ n[15] ^ n[16];
// 	d[30] = m[14][16] ^ n[14] ^ n[15] ^ n[16];
// 	d[31] = m[15][16] ^ n[15] ^ n[16];
// 	d[32] = n[16];
// 	return d;
// endfunction

endpackage: kmul