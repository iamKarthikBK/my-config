#include "ecc.h"

int ecc_get_config_default(volatile ECC_device* ecc)
{
  ecc->config = ((CONFIG_DECRYPT(0) | CONFIG_KEY_TYPE(Bit128) | CONFIG_MODE(ECB) | CONFIG_ENDIAN(LITTLE)) & 0xffff) ;
}