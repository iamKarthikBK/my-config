# crypto-accel

## Area Optimised Design

```bash

cd ecc/hw/
make

```

## Performance Optimised Design

```bash

git checkout c971ff4e1ee87443ac89cf0fac71e4b7f41b06a2
cd ecc/hw/
make

```

The generated verilog sources can be found in ``build/hw/verilog``.

Steps to generate verilog and run all tests using cocotb:

```bash

cd ecc/hw/
make all

```

The top module can be changed in ``Makefile.inc``.

Signals from the pubkey_gen DUT:

```txt

Ports:
Name                         I/O  size props
RDY_ma_request_ops             O     1
mv_pubkey_fst                  O   233 reg
RDY_mv_pubkey_fst              O     1
mv_pubkey_snd                  O   233 reg
RDY_mv_pubkey_snd              O     1
CLK                            I     1 clock
RST_N                          I     1 reset
ma_request_ops_priv_key        I   233 reg
EN_ma_request_ops              I     1

```