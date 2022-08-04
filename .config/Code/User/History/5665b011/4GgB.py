import cocotb
from cocotb.triggers import Time, RisingEdge
from cocotb_coverage.coverage import *
from env import *
import user_config
import checker

log = cocotb.logging.getLogger("cocotb")

@cocotb.test
def single_scalar(dut):
    """Drives a single private key to the DUT and verifies it's result.
    """

    tb = Tb(dut)