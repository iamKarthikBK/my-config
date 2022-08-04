set_attribute lib_search_path /path/to/library/
set_attribute library { LIBRARY_NAME.lib }
read_hdl mk_pubkey_gen.v
read_hdl mk_multiplier.v
elaborate
read_sdc constrs.sdc
syn_gen
syn_map
syn_opt
report_timing
report_power
report_area
write_db -all_root_attributes DESIGN_NAME.db