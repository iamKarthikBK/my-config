#include "ecc.h"

#pragma GCC push_options
#pragma GCC optimize ("unroll-loops")
int ECC_set_privkey (volatile ECC_device* ecc, const dw* key, ECC_key_type key_type)
{
    if(key_type == Bit233)
    {
    for(int i=0; i<num_key_regs; i++)
        ecc->key[i] |= key[i];
    }
    else
    {
    for(int i=0;i<4;i++)
        ecc->key[i] |= key[i];
    }
}