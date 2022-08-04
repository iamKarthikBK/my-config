#include <stdio.h>
#include "ecc.h"

int main()
{
    volatile ECC_device *ecc = (ECC_device*)0x00050000;

    uint32_t input[6] = {
        0xdeadbeef,
        0xbabecafe,
        0xdeadbeef,
        0xbabecafe,
        0xdeadbeef,
        0xbabecafe
    };

    printf("Starting Configuration at %x\n\n", ecc);
    ECC_get_config_default(ecc);
    printf("Starting Input at %x\n\n", ecc->inp);
    ECC_set_input(ecc, input);
    return 0;
}