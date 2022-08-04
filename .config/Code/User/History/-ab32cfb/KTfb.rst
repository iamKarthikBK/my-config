##########################
Logical Order of Execution
##########################

===========
package ECC
===========

------------------------
module mkecc_config_regs
------------------------

1. rl_set_idle
2. rl_update_status *
3. rl_set_counter *
4. rl_set_inp_ready
5. rl_start_pkgen
6. rl_get_pubkey

.. note:: '*' indicates that the rule fires every cycle.

==================
package pubkey_gen
==================

--------------------
module mk_pubkey_gen
--------------------

1. ma_start
2. rl_obtain_pubkey
3. rl_transform_pa
4. rl_trans_pa_recv

