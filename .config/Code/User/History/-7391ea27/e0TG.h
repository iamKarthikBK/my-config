#include <stdint.h>

typedef uint64_t dw;
#define num_inp_regs 1
#define num_key_regs 8
#define num_outp_regs 16

typedef enum { 
	Bit233
} ECC_key_type;

typedef struct {
    dw       inp[num_inp_regs];
    dw       outp[num_outp_regs];
    dw       key[num_key_regs];
    uint32_t status;
} ECC_device;

#define STATUS_IDLE               1 << 0
#define STATUS_OUTP_READY         1 << 1

#define CONFIG_OUT_ACCESS_SIZE(x) x << 10
#define CONFIG_IN_ACCESS_SIZE(x)  x << 8
#define CONFIG_KEY_TYPE(x)        x << 1
