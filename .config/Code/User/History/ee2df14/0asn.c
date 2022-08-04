#include <stdio.h>
#include "ecc.c"

int main()
{
    volatile ECC_device *ecc = (ECC_device*)0x00050100;

    uint32_t input[8] = {
        0x00000000,
        0x00000000,
        0xdeadbeef,
        0xbabecafe,
        0xdeadbeef,
        0xbabecafe,
        0xdeadbeef,
        0xbabecafe
    };

    uint32_t output[16];

    printf("Starting Configuration at %x\n\n", ecc);
    printf("Starting Input at %x\n\n", ecc->key);
    ECC_set_privkey(ecc, input, Bit233);

    printf("Starting Output at %x\n\n", ecc->outp);
    ECC_get_pubkey(ecc, output, Bit233);
    printf("Output: %x %x %x %x %x %x %x %x %x %x %x %x %x %x %x\n",
            output[0], output[1], output[2], output[3], output[4], output[5], output[6], output[7],
            output[8], output[9], output[10], output[11], output[12], output[13], output[14], output[15]);
    return 0;
}