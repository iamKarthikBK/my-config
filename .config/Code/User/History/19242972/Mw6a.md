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