from cocotb_test.simulator import run
import pytest
import os
import shlex
import shutil
from pathlib import Path
import logging
#from utils import *
import utils
from user_config import *
import filecmp
from cocotb_coverage.coverage import *

# load the test-list yaml
test_list = utils.load_yaml(testlist_path)['test_list']

# here we derive additional constants based on the settings in config.py
hw_verilog = repo + '/build/hw/verilog/'
bscbuild = repo + '/build/hw/intermediate/'

test_build = './build/'

# compile time args required for verilator
compile_args = shlex.split("-O3 --x-assign fast --x-initial fast --noassert \
        --bbox-sys -Wno-STMTDLY -Wno-UNOPTFLAT -Wno-WIDTH -Wno-lint \
        -Wno-COMBDLY -Wno-TIMESCALEMOD -Wno-INITIALDLY --autoflush \
        -y {0}/Verilog/ -y {1} --output-split 20000  --output-split-ctrace 10000 \
        --trace --trace-structs \
        -DBSV_RESET_FIFO_HEAD -DBSV_RESET_FIFO_ARRAY".format(
    bsclib, hw_verilog))


#@pytest.mark.env("run")
@pytest.mark.parametrize('testname', test_list)
def test_run(testname):

    os.makedirs(test_build + testname, exist_ok=True)
    os.symlink('../../tests/' + testname + '.py',
               test_build + testname + '/' + testname + '_temp')
    os.rename(test_build + testname + '/' + testname + '_temp',
              test_build + testname + '/' + testname + '.py')

    # initiate the fun
    run(verilog_sources=[hw_verilog + '/mk_pubkey_gen.v'],
        toplevel_lang='verilog',
        toplevel='mk_pubkey_gen',
        module=testname,
        compile_args=compile_args,
        plus_args=[''],
        extra_env=myenv,
        work_dir='build/' + testname,
        sim_build='./sim_build')


# function to merge coverage files
def test_merge():
    mergecovfile = str(os.getcwd()) + '/merge_coverage.yml'
    files = []
    for test in test_list:
        files.append(test_build + test + '/coverage.yml')
    merge_coverage(utils.log.info, mergecovfile, *files)


# This function is used to just compile the verilog code using verilator. This
# is done once before you spawn of regression to avoid each thread from building
# it parallely
#@pytest.mark.env("compile_only")
def test_compile():

    utils.log.info('Compile the Verilog')

    # initiate the run
    run(verilog_sources=[hw_verilog + '/mk_scalar_mult.v'],
        toplevel_lang='verilog',
        toplevel='mk_scalar_mult',
        module='test',
        compile_args=compile_args,
        compile_only=True,
        force_compile=True,
        plus_args=[''],
        extra_env=myenv,
        sim_build='./sim_build')


# This test is used to clean the build environments that were created because of
# the runs
#@pytest.mark.env("clean")
def test_clean():
    utils.log.info('Running Clean')
    simbuild = './sim_build/'
    if os.path.exists(simbuild):
        utils.log.info('Removing : ' + str(simbuild))
        shutil.rmtree(simbuild, ignore_errors=True)
    build = './build/'
    if os.path.exists(build):
        utils.log.info('Removing : ' + str(build))
        shutil.rmtree(build, ignore_errors=True)
