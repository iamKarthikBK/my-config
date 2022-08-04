import cocotb
from cocotb.triggers import Time, RisingEdge
from cocotb_coverage.coverage import *
from env import *
import user_config
import checker

log = cocotb.logging.getLogger("cocotb")
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

def dumping_coverage(tb, dut, instr):
    '''Common function used by all tests to dump coverage
    using export_to_yaml and export_to_xml
    
    Args:
        tb (cocotb_env.Tb): testbench for dut for which coverage is to be dumped
        dut (dut): dut for which coverage is to be dumped
        instr (dict): instruction dictionary
        
    '''
    cov_enabled = True
    if cov_enabled:
        tb.logger.info('Dumping out coverage')
        coverage_db.report_coverage(log.info, bins=True)
        coverage_db.export_to_yaml(filename="coverage.yml")
        coverage_db.export_to_xml(filename="coverage.xml")

@cocotb.test
def single_scalar():
    """Drives a single private key to the DUT and verifies it's result.
    """