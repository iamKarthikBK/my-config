
VERILOGDIR:=build/hw/verilog

BSVBUILDDIR:=build/hw/intermediate

BSVOUTDIR:=bin

BSCCMD:=bsc -u -verilog -elab -vdir build/hw/verilog -bdir build/hw/intermediate -info-dir build/hw/intermediate +RTS -K4000M -RTS -check-assert  -keep-fires -opt-undetermined-vals -remove-false-rules -remove-empty-rules -remove-starved-rules -remove-dollar -unspecified-to X -show-schedule -show-module-use  -suppress-warnings G0010:T0054:G0020:G0024:G0023:G0096:G0036:G0117:G0015

BSC_DEFINES:=Addr_space=22 ASSERT rtldump RV64 ibuswidth=64 dbuswidth=64 resetpc=4096 paddr=32 vaddr=64 causesize=6 CORE_AXI4 iesize=2 desize=1 dtvec_base=256 simulate atomic spfpu dpfpu compressed muldiv MULSTAGES=1 DIVSTAGES=32 user supervisor asidwidth=9 itlbsize=4 dtlbsize=4 sv39 pmp pmpsize=4 pmp_grainbits=3 bpu gshare btbdepth=32 bhtdepth=512 histlen=8 histbits=5 rasdepth=8 bpureset=1 bpu_ras iwords=4 iblocks=16 iways=4 isets=64 ifbsize=4 icache_onehot=0 icache icachereset=1 ifence irepl=1 dwords=8 dblocks=8 dways=4 dsets=64 dfbsize=8 dsbsize=2 dcache_onehot=0 dcache dcachereset=1 drepl=1 perfmonitors csr_grp4 csr_grp5 csr_grp6 csr_grp7 counters_grp4=7 counters_grp5=7 counters_grp6=7 counters_grp7=8 counters_size=29

BSVINCDIR:=.:%/Libraries:chromite/src/:chromite/src/predictors:chromite/src/m_ext:chromite/src/fpu/:chromite/src/m_ext/multiplier_designs:chromite/src/csr:chromite/src/csr/daisy_chain:fabrics/axi4:fabrics/axi4_lite:fabrics/apb:fabrics/bridges:cache_subsystem/src/icache:cache_subsystem/src/dcache:cache_subsystem/src/tlbs:cache_subsystem/src/pmp:devices/rom:devices/uart:devices/clint:devices/ram2rw:devices/riscv_debug/:devices/jtagdtm:common_bsv/:bsvwrappers/common_lib/:../aes/hw/aes_registers/src

BS_VERILOG_LIB:=/opt/bluespec/lib/Verilog/

TOP_MODULE:=mkTbSoc

TOP_DIR:=.

TOP_FILE:=TbSoc.bsv

VERILATOR_FLAGS:= -O3 -LDFLAGS "-static" --x-assign fast  --x-initial fast --noassert sim_main.cpp --bbox-sys -Wno-STMTDLY  -Wno-UNOPTFLAT -Wno-WIDTH -Wno-lint -Wno-COMBDLY -Wno-INITIALDLY  --autoflush   --threads 1 -DBSV_RESET_FIFO_HEAD  -DBSV_RESET_FIFO_ARRAY --output-split 20000  --output-split-ctrace 10000

VERILATOR_SPEED:=OPT_SLOW="-O3" OPT_FAST="-O3"

XLEN:=64

TOP_BIN=TbSoc.bo

include depends.mk
