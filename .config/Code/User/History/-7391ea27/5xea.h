#include <stdint.h>

typedef uint64_t dw;
#define num_key_regs 8
#define num_outp_regs 16

typedef enum { 
	Bit233
} ECC_key_type;

typedef struct {
    dw       key[num_key_regs];
    dw       outp[num_outp_regs];
    uint32_t status;
} ECC_device;

#define STATUS_IDLE               1 << 1
#define STATUS_OUTP_READY         1 << 0
#define CONFIG_KEY_TYPE(x)        x << 1
