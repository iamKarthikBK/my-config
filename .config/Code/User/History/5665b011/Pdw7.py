import cocotb
from cocotb.triggers import Time, RisingEdge
from cocotb_coverage.coverage import *
from env import *

log = cocotb.logging.getLogger("cocotb")

# testbench

def initialize(dut):
    '''
    Initialises the environment for testing
    
    Args:
        dut (dut): dut for which the environment is to initialised
    
    Returns:
        tb (cocotb_env.Tb): testbench for dut for which coverage is to be dumped
        XLEN (int): XLEN of the dut
        instr (dict): instruction list to be created
        inst_dict (dict): instruction dictionary created from instruction class
    '''
    
    # instantiate the device under test
    tb = Tb(dut)
    # size of registers
    XLEN = tb.XLEN
    # list of test vectors
    instr = []
    # preparing inst_dict based on XLEN
    inst_dict = {}
    for i in bitmanip_checker.instruction.inst_dict:
        if '64_only' in i and 'zbp' in i:
            if XLEN == 64:
                inst_dict.update(bitmanip_checker.instruction.inst_dict[i])
        elif 'zbp' in i:
            inst_dict.update(bitmanip_checker.instruction.inst_dict[i])
    return(tb,XLEN,instr,inst_dict)

@cocotb.test
def single_scalar():
    """Drives a single private key to the DUT and verifies it's result.
    """