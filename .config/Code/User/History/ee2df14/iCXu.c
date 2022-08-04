#include <stdio.h>
#include "ecc.h"

int main()
{
    volatile ECC_device *ecc = (ECC_device*)0x00050000;

    uint32_t input[8] = {
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
    ECC_set_privkey(ecc, input);

    printf("Starting Output at %x\n\n", ecc->outp);
    ECC_get_pubkey(ecc, output);
    return 0;
}