File structure:

```txt
.
├── docs
│   ├── cycles.rst
│   ├── ecdh.rst
│   └── rules_sched.rst
├── hw
│   ├── alias_signals.yaml
│   ├── axi_test
│   │   ├── ECC_template_32.bsv
│   │   ├── ECC_template_64.bsv
│   │   └── TbECC.bsv
│   ├── Makefile
│   ├── Makefile.inc
│   ├── manager.sh
│   ├── misc
│   │   ├── Makefile
│   │   ├── multiplier.bsv
│   │   ├── RegV.bsv
│   │   └── TB.bsv
│   ├── requirements.txt
│   ├── sim_main.cpp
│   ├── source
│   │   ├── accel.defines
│   │   ├── ECC.bsv
│   │   ├── group_ops.bsv
│   │   ├── inverse.bsv
│   │   ├── multiplier.bsv
│   │   ├── primitives.bsv
│   │   ├── pubkey_gen.bsv
│   │   ├── scalar_mult.bsv
│   │   └── transformation.bsv
│   └── test
│       ├── checker.py
│       ├── coverage.py
│       ├── env.py
│       ├── refs
│       │   └── model.py
│       ├── testbench.py
│       ├── test_list.yaml
│       ├── test_top.py
│       ├── user_config.py
│       └── utils.py
└── sw
    ├── ecc.c
    ├── main.c
    ├── Makefile
    └── Makefile.inc

8 directories, 38 files

```

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
RDY_ma_wait                    O     1
mv_done                        O     1 reg
RDY_mv_done                    O     1 const
mv_pubkey_fst                  O   233
RDY_mv_pubkey_fst              O     1 reg
mv_pubkey_snd                  O   233
RDY_mv_pubkey_snd              O     1 reg
priv_key                       I   233
CLK                            I     1 clock
RST_N                          I     1 reset
EN_ma_request_ops              I     1
EN_ma_wait                     I     1 unused

```
