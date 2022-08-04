#include <stdint.h>

typedef uint64_t dw;
#define num_inp_regs 16/sizeof(dw)
#define num_outp_regs 32/sizeof(dw)

typedef enum { 
	Bit233
} ECC_key_type;

typedef struct {
    dw      inp[num_inp_regs];
    dw      outp[num_outp_regs];
    uint8_t status;
    uint8_t reserved0;
    uint8_t config;
} ECC_device;

#define STATUS_IDLE               1 << 0
#define STATUS_OUTP_READY         1 << 1

#define CONFIG_OUT_ACCESS_SIZE(x) x << 10
#define CONFIG_IN_ACCESS_SIZE(x)  x << 8
#define CONFIG_KEY_TYPE(x)        x << 1
