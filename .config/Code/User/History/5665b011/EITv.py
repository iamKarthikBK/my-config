import cocotb
from cocotb.triggers import Time, RisingEdge
from cocotb_coverage.coverage import *
from env import *
import user_config

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

def running_coverage(tb, dut, instr):
    '''Common function for all tests to get coverage report
    
    Args:
        tb (cocotb_env.Tb): testbench for dut for which coverage is to be dumped
        dut (dut): dut for which coverage is to be dumped
        instr (dict): instruction dictionary
    '''
    enables = load_yaml(user_config.testlist_path)['test_list']
    for val in enables:
        node = val.split('_')[1]
        try:
            if val:
                tb.logger.debug('Enabling Coverage for : ' + str(node))
                exec('from coverage import coverage_{0}'.format(node))
                exec('coverage_{0}.Coverage(dut)'.format(node))
                cov_enabled = True
        except:
            raise SystemError('invalid coverage {0} name enabled'.format(node))

@cocotb.test
def single_scalar():
    """Drives a single private key to the DUT and verifies it's result.
    """