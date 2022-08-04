repo = '/home/karthik/incore/crypto-accel/ecc/'

# provide absolute path of the alias signal file
alias_file = '/home/karthik/incore/crypto-accel/ecc/alias_signal.yaml'

# set this path the lib directory of your bsc installation
bsclib = '/opt/bluespec/lib/'

# these are cocotb environment settings. Refer to
# https://docs.cocotb.org/en/stable/building.html for details on what can be set
# here
myenv = {
    #        "LIBPYTHON_LOC": "/usr/lib/x86_64-linux-gnu/libpython3.8.so",
    "COCOTB_REDUCED_LOG_FMT": "TRUE",
    "COCOTB_LOG_LEVEL": "INFO"
}

testlist_path = 'test_list.yaml'
