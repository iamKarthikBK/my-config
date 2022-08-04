#include <stdio.h>
#include "ecc.c"

int main()
{
    volatile ECC_device *ecc = (ECC_device*)0x00050100;

    uint64_t input[4] = {
        0x0000000000000000,
        0x0000000000000000,
        0x0000000000000000,
        0x0000000000000003
    };

    uint64_t output[8] = {0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0};

    printf("Starting Configuration at %llx\n\n", ecc);
    printf("Reading status from %llx\n", &ecc->status);
    ECC_read_status(ecc);
    printf("Starting Input at %llx\n\n", ecc->key);
    ECC_set_privkey(ecc, input);
    printf("Reading status from %llx\n", &ecc->status);
    ECC_read_status(ecc);
    printf("Starting Output at %llx\n\n", ecc->outp);
    ECC_get_pubkey(ecc, output);
    printf("Public key:\nx: %llx%llx%llx%llx\ny: %llx%llx%llx%llx\n",
            output[3], output[2], output[1], output[0], output[7], output[6], output[5], output[4]);
    return 0;
}