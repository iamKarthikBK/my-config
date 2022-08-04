#include <stdint.h>

typedef uint64_t dw;
#define num_inp_regs 16/sizeof(dw)
#define num_outp_regs 32/sizeof(dw)

typedef enum { 
	Bit233
} ECC_key_type;