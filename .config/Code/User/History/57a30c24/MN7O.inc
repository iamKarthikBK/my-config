############ DO NOT CHANGE THESE ################
INCDIR:=.:%/Prelude:%/Libraries:source:$(FILES)
TOP_MODULE:=mkMME

############# User changes to be done below #################
TOP_DIR:=./src
TOP_FILE:=pubkey_gen.bsv
FILES:=./fabrics/axi4:./fabrics/axi4_lite:./fabrics/apb:./common_bsv
