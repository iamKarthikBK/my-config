package TbECC;
    import axi4 :: * ;
    import axi4l :: * ;
    import apb :: * ;
    import Connectable :: * ;
    import DCBus :: * ;
    import StmtFSM :: * ;
    import ConfigReg :: * ;
    import ECC :: * ;
    import ECC_template_64 :: * ;
    import Semi_FIFOF :: * ;

    `define aw 32
    `define dw 64
    `define uw 0
    `define base 'h12300

    module mk_TB(Empty);
        Reg#(Bit#(`aw)) rg_state <- mkConfigReg(0);
        Integer inp = 'h0, outp = 'h20, st = 'h60;
        let ecc_inst <- mk_inst_ecc_axi4l;
        Ifc_axi4l_master_xactor#(`aw, `dw, `uw) xactor <- mkaxi4l_master_xactor(defaultValue);
        mkConnection(xactor.axi4l_side, ecc_inst.slave);
        Reg#(Bit#(256)) rg_pkx <- mkReg(0);
        Reg#(Bit#(256)) rg_pky <- mkReg(0);

        function Bit#(n) zeroExtendLSB(Bit#(m) inpp) provisos(Add#(m,a__,n));
            Bit#(TSub#(n,m)) zeros= 0;
            return {inpp,zeros};
        endfunction

        function Tuple2#(Axi4l_wr_addr#(`aw, `uw), Axi4l_wr_data#(`dw)) gen_axi4l_packet(Integer inp_addr, Bit#(`dw) inp_data);
            Bit#(`aw) addr= fromInteger(`base + inp_addr);
            Bit#(TDiv#(`dw,8))        strb= (`dw==32) ? '1 : ((addr & 'b100)==0 ? zeroExtend(4'hf) : zeroExtendLSB(4'hf));
            Axi4l_wr_data#(`dw)       packet_data= Axi4l_wr_data { wdata: inp_data, wstrb: strb };
    
            addr= (`dw==64) ? {addr[`aw-1:3],3'b000} : {addr[`aw-1:2], 2'b00};
            Axi4l_wr_addr#(`aw, `uw)  packet_addr= Axi4l_wr_addr { awaddr: addr, awprot: 'd3,  awuser: ? };
    
            return tuple2(packet_addr, packet_data);
        endfunction

        function Action send_axi_packet (Integer inp_addr, Bit#(`dw) inp_data) = action
            let {addr, data} = gen_axi4l_packet(inp_addr, inp_data);
            xactor.fifo_side.i_wr_addr.enq(addr);
		    xactor.fifo_side.i_wr_data.enq(data);
        endaction;

        function Action recv_axi_packet (Bit#(32) inp_addr) = action
            xactor.fifo_side.i_rd_addr.enq(Axi4l_rd_addr { araddr: inp_addr });
        endaction;

        Stmt s = (
            par
                seq
                    par
                        $dumpfile("dump.vcd");
                        $dumpvars;
                        $dumpon;
					endpar
                    $display("Sending axi packets");
                    noAction;
                    send_axi_packet (inp,       'h0000000000000000);
                    send_axi_packet (inp+8,     'hdeadbeefbabecafe);
                    send_axi_packet (inp+16,    'hdeadbeefbabecafe);
                    send_axi_packet (inp+24,    'hdeadbeefbabecafe);
                    noAction;
                    $display("Sent all axi packets");
                endseq

                while(True)
                action
                    let x <- pop_o(xactor.fifo_side.o_wr_resp);
                    $display("xactor.fifo_side.o_wr_resp: ", fshow(x));
                endaction

                seq
                    noAction;
                    par
                        $display("Awaiting axi outp_ready");
                        await(ecc_inst.device.mv_output_ready);
                    endpar
                    par
                        $display("axi output ready... reading outputs");
                        noAction;
                        recv_axi_packet(fromInteger(`base+outp));
                        recv_axi_packet(fromInteger(`base+outp) + 8);
                        recv_axi_packet(fromInteger(`base+outp) + 16);
                        recv_axi_packet(fromInteger(`base+outp) + 24);
                        recv_axi_packet(fromInteger(`base+outp) + 32);
                        recv_axi_packet(fromInteger(`base+outp) + 40);
                        recv_axi_packet(fromInteger(`base+outp) + 48);
                        recv_axi_packet(fromInteger(`base+outp) + 56);
                        noAction;
                    endpar
                    action
                        let res <- pop_o(xactor.fifo_side.o_rd_data);
                        $display("Got axi output: %h", res);
                    endaction
                    $display($time);
                    noAction;
                    $finish(0);
                endseq

                while(True)
                action
                    let res <- pop_o(xactor.fifo_side.o_rd_data);
                    $display("xactor.fifo_side.o_rd_data: ", fshow(res));
                endaction
            endpar
        );
        mkAutoFSM(s);
    endmodule: mk_TB
endpackage: TbECC