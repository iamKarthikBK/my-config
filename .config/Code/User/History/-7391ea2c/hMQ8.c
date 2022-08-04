#include <stdint.h>

typedef uint64_t dw;
#define num_key_regs 8
#define num_outp_regs 16

typedef struct {
    dw       key[num_key_regs];
    dw       outp[num_outp_regs];
    uint32_t status;
} ECC_device;

#define STATUS_IDLE               1 << 1
#define STATUS_OUTP_READY         1 << 0

#pragma GCC push_options
#pragma GCC optimize ("unroll-loops")
int ECC_set_privkey (volatile ECC_device* ecc, const dw* key)
{
    if (ecc->status & STATUS_IDLE) {
        for(int i=0; i<num_key_regs; i++) {
            ecc->key[i] |= key[i];
        }
    }
}
#pragma GCC pop_options

#pragma GCC push_options
#pragma GCC optimize ("unroll-loops")
int ECC_get_pubkey (volatile ECC_device* ecc, dw* pubkey)
{
    if (ecc->status & STATUS_OUTP_READY) {
        for(int i=0; i<num_key_regs; i++) {
            pubkey[i] = ecc->outp[i];
        }
    }
}
#pragma GCC pop_options