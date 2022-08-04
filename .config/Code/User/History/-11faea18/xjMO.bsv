package ECC_template_32;
    import axi4 :: * ;
    import axi4l :: * ;
    import apb :: * ;
    import ECC :: * ;

    `define aw 32
    `define dw 32
    `define uw 0
    `define base 'h12300

    (* synthesize *)
    module mk_inst_ecc_axi4l(Ifc_ecc_axi4l#(`aw, `dw, `uw));
        let curr_clk <- exposeCurrentClock;
        let curr_rst <- exposeCurrentReset;
        let ifc();
        mkecc_axi4l#(`base, curr_clk, curr_rst) _temp(ifc);\
        return ifc;
    endmodule: ,mk_inst_ecc_axi4l
endpackage: ECC_template_32