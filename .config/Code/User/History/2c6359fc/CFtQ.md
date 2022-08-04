# crypto-accel

Steps to generate verilog:

```bash

cd ecc/
make

```

The generated verilog sources can be found in ``build/hw/verilog``.

Steps to generate verilog and run all tests using cocotb:

```bash

cd ecc/
make all

```

The top module can be changed in ``Makefile.inc``.
