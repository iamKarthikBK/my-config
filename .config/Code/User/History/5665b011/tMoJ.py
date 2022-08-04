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
    tb.logger.info('Starting Simulation')
    yield tb.start_sim(clk_delay=5, rst_delay=200)

    dut.priv_key.value = 0
    cocotb.fork(tb.validate_inputs(dut.EN_ma_request, tb.dut.CLK))