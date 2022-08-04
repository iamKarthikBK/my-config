#include <stdint.h>

typedef uint64_t dw;
#define num_key_regs 4
#define num_outp_regs 8

typedef struct {
    dw       key[num_key_regs]; // 0x00 -> 0x20
    dw       outp[num_outp_regs]; // 0x20 -> 0x60
    uint32_t status; // 0x60 -> 0x64
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
            printf("Sent %llx to %x\n", key[i], &(ecc->key[i]));
        }
    }
}
#pragma GCC pop_options

#pragma GCC push_options
#pragma GCC optimize ("unroll-loops")
int ECC_get_pubkey (volatile ECC_device* ecc, dw* pubkey)
{
    while (!(ecc->status & STATUS_OUTP_READY)) continue;
    printf("Output Ready.. Reading\n");
    for(int i=0; i<num_outp_regs; i++) {
        pubkey[i] = ecc->outp[i];
        printf("Obtained %llx from %x\n", pubkey[i], &(ecc->outp[i]));
    }
}
#pragma GCC pop_options

#pragma GCC push_options
#pragma GCC optimize ("unroll-loops")
int ECC_read_status (volatile ECC_device* ecc)
{
    printf("Status Register: %x\n", ecc->status);
}
#pragma GCC pop_options