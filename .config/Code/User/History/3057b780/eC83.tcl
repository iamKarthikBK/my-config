set_attribute lib_search_path /home/chips/55nm/umc55lp/SubVt/Inv_Synth
set_attribute library {u055lscspmvbbr_110c-40_bc.lib}
read_hdl mk_pubkey_gen.v
read_hdl mk_multiplier.v
elaborate
read_sdc constrs.sdc
syn_gen
syn_map
syn_opt
report_timing > timing.rpt
report_power > power.rpt
report_area > area.rpt
write_db -all_root_attributes mk_pubkey_gen_synth.db