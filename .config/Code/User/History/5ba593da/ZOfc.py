import cocotb
from cocotb.clock import Clock
from cocotb.decorators import coroutine
from cocotb.triggers import Timer, RisingEdge
from cocotb_bus.monitors import Monitor
from cocotb.binary import BinaryValue
from cocotb.result import TestFailure
from cocotb.log import SimLog
from cocotb_bus.scoreboard import Scoreboard
from datetime import datetime
from pathlib import Path
from utils import *

import os
import logging
import random
import sys
import ctypes


class Checker:

    def __init__(self, dut, enlog=False):

        self.name = "crypto-accel"
        self.log = logging.getLogger("cocotb")

        if enlog:
            self.log.info('Setting up Output Monitor')
        self.output_mon = OMonitor(dut, enlog=enlog)

        if enlog:
            self.log.info('Setting up Input Monitor')
        self.input_mon = IMonitor(dut, callback=self.model, enlog=enlog)

        self.log.info('Setting up Score-board')
        self.expected_output = []
        self.scoreboard = MyScoreboard(dut)
        self.scoreboard.add_interface(self.output_mon, self.expected_output)

    def run_ref_model(self, transaction):
        try:
            ref_model.run(transaction)
        except Exception:
            pass

    def model(self, transaction, flag=False):
        """Model """
        # This function acts as the model for the dut under test
        result = None

        result = self.run_ref_model(transaction)
        self.log.info(f'Ref Model\t input: {transaction} result: {result}')

        if not flag:
            self.expected_output.append(result)
        else:
            return result


class MyScoreboard(Scoreboard):
    # This is the scoreboard class. You need to define how the comparison needs
    # to be happen between data received from dut and that received from the
    # model
    def compare(self, got, exp, log, **_):
        got_output = got
        exp_output = exp
        # self.log.info(f'compare\t dut out:{got_output:#016X} ref out:{exp_output:#016X}')
        assert got_output == exp_output, "crypto-accel.scoreboard: Expected: {0!s} but received: {1!s}.".format(
            hex(exp_output), hex(got_output))


class IMonitor(Monitor):
    """Observes inputs of DUT."""
    # utils has loaded the alias_signal.yaml. Use the below function to populate
    # the _signals as a dictionary of all alias-signal mapping. First argument
    # is the sub-module name (without hierarchy) and the next argument is the
    # category : inputs, outputs, registers.
    _signals = get_signals('mk_pubkey_gen', 'inputs')

    def __init__(self, dut, callback=None, event=None, enlog=False):
        # the following will populate the alias as methods of the self object so
        # that you can access the methods as self.op1, etc.
        for alias, signal in self._signals.items():
            setattr(self, alias, getattr(dut, signal))

        # set the clock that may or maynot be required
        self.clock = dut.CLK

        # The following 3 lines are necessary, else cocotb 1.5.2 will complaint.
        # You can change the name though. imon= input monitor, omon = output
        # monitor, smon = internal signal monitor, etc.
        self.name = "crypto-accel.imon"
        self.log = logging.getLogger("cocotb")
        self.enlog = enlog
        Monitor.__init__(self, callback, event)

    @coroutine
    def _monitor_recv(self):
        # This is going to a forked coroutine which will sample the signals of
        # choice
        while True:
            # wait for posedge of clock
            yield RisingEdge(self.clock)

            # increment by 1 more second
            yield Timer(10, units="ps")

            # trigger sample inputs when the operation is detected
            if self.en.value.integer == 1:

                # sample the inputs and send to _recv method. All samples must
                # be sent to _recv. This is what is available to the model. IT
                # could be a tuple, dictionary, list, etc. The same must be
                # assumed in the model as well
                vec = (self.priv_key)
                self._recv(vec)
                if self.enlog:
                    for x in vec:
                        self.log.debug('input: ' + str(x))


class OMonitor(Monitor):
    """Observes outputs of DUT."""
    # utils has loaded the alias_signal.yaml. Use the below function to populate
    # the _signals as a dictionary of all alias-signal mapping. First argument
    # is the sub-module name (without hierarchy) and the next argument is the
    # category : inputs, outputs, registers.
    _signals = get_signals('mk_test', 'outputs')

    def __init__(self, dut, callback=None, event=None, enlog=False):
        """tb must be an instance of the Testbench class."""
        # the following will populate the alias as methods of the self object so
        # that you can access the methods as self.op1, etc.
        for alias, signal in self._signals.items():
            setattr(self, alias, getattr(dut, signal))
        # set the clock that may or maynot be required
        self.clock = dut.CLK

        # The following 3 lines are necessary, else cocotb 1.5.2 will complaint.
        # You can change the name though. imon= input monitor, omon = output
        # monitor, smon = internal signal monitor, etc.
        self.name = "crypto-accel.omon"
        self.log = logging.getLogger("cocotb")
        self.enlog = enlog
        Monitor.__init__(self, callback, event)

    @coroutine
    def _monitor_recv(self):
        # This is going to a forked coroutine which will sample the signals of
        # choice
        while True:
            # wait for posedge of clock
            yield RisingEdge(self.clock)

            # increment by 5 more pico-second. This is so that the output from the
            # combo is available. Doing it at "moment" (same as inputs) might not
            # work.
            yield Timer(10, units="ps")

            # trigger sample inputs when the operation is detected
            if (self.pub_key_x_rdy.value.integer == 1 and self.pub_key_y_rdy.value.integer == 1):

                # Assist the output according to xlen, For "Dual Register" operations
                # this is needed.. to get the extra `xlen` output along with the
                # overflow flag set in those operations
                recv_val = (self.pub_key_x.value.integer, self.pub_key_y.value.integer)
                self._recv(recv_val)
                if self.enlog:
                    self.log.debug(f'crypto-accel.omon: {hex(recv_val)}')
