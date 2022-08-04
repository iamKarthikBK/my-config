#include <stdio.h>
#include "ecc.c"

int main()
{
    volatile ECC_device *ecc = (ECC_device*)0x00050100;

    uint64_t input[4] = {
        0x0000000000000000,
        0xdeadbeefbabecafe,
        0xdeadbeefbabecafe,
        0xdeadbeefbabecafe
    };

    uint64_t output[8];

    printf("Starting Configuration at %x\n\n", ecc);
    printf("Reading status from %x\n", &ecc->status);
    printf("Starting Input at %x\n\n", ecc->key);
    ECC_set_privkey(ecc, input);

    printf("Starting Output at %x\n\n", ecc->outp);
    ECC_get_pubkey(ecc, output);
    printf("Output: %x %x %x %x %x %x %x %x %x %x %x %x %x %x %x\n",
            output[0], output[1], output[2], output[3], output[4], output[5], output[6], output[7],
            output[8], output[9], output[10], output[11], output[12], output[13], output[14], output[15]);
    return 0;
}