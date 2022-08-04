import cocotb
from cocotb.triggers import Time, RisingEdge
from cocotb_coverage.coverage import *

log = cocotb.logging.getLogger("cocotb")

# testbench

@cocotb.test
def single_scalar():
    """Drives a single private key to the DUT and verifies it's result.
    """