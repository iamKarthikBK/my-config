package ECC_template_32;
    import axi4 :: * ;
    import axi4l :: * ;
    import apb :: * ;
    import ECC :: * ;

    `define aw 32
    `define dw 32
    `define uw 0
    `define in_depth 4
    `define out_depth 5
    `define base 'h12300

    (* synthesize *)
    module mk_inst_ecc_axi4l(Ifc_ecc_axi4l#(`aw, `dw, `uw));
    endmodule: ,mk_inst_ecc_axi4l
endpackage: ECC_template_32