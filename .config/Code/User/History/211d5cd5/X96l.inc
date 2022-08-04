############ DO NOT CHANGE THESE ################
INCDIR:=.:%/Prelude:%/Libraries:$(FILES)
TOP_MODULE:=mk_TB

############# User changes to be done below #################
TOP_DIR:=./axi_test
TOP_FILE:=TbECC.bsv
FILES:=./source:./axi_test:./fabrics/axi4:./fabrics/axi4_lite:./fabrics/apb:./common_bsv
