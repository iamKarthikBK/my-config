import cocotb
from cocotb.triggers import Time, RisingEdge
from cocotb_coverage.coverage import *

log = cocotb.logging.getLogger("cocotb")

# testbench

@cocotb.test
def single_scalar():
    """"""