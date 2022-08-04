############ DO NOT CHANGE THESE ################
INCDIR:=.:%/Prelude:%/Libraries:source:$(FILES)
TOP_MODULE:=mk_ecc

############# User changes to be done below #################
TOP_DIR:=./source
TOP_FILE:=ECC.bsv
FILES:=./fabrics/axi4:./fabrics/axi4_lite:./fabrics/apb:./common_bsv
