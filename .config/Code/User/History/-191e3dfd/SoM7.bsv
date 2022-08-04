package Soc_instances;
  
  import Clocks           :: *;
  import Connectable:: *;
  import GetPut:: *;
	import axi4             :: * ;
	import apb              :: * ;
	import bridges          :: * ;
  import ccore_types      :: * ;
  import DCBus            :: * ;
  import Vector::*;
  // peripheral imports
  import uart             :: * ;
  import clint            :: * ;
  import sign_dump        :: * ;
  import ram2rw           :: * ;
  import rom              :: * ;
  import mem_config       :: * ;
  import AES              :: * ;

  import riscv_debug_types::*;                                                                          
  import debug_loop::*;
  `include "ccore_params.defines"
  `include "Soc.defines"

  (*synthesize*)
  module mkuart(Ifc_uart_apb#(`paddr, 32, USERSPACE, 16));
  	let clk <-exposeCurrentClock;
  	let reset <-exposeCurrentReset;
    let ifc();
    mkuart_apb#(5, `UartBase, clk, reset) _temp(ifc);
    return ifc;
  endmodule:mkuart
  (*synthesize*)
  module mkclint(Ifc_clint_apb#(`paddr, 32, USERSPACE, 8, 1));
  	let clk <-exposeCurrentClock;
  	let reset <-exposeCurrentReset;
    let ifc();
    mkclint_apb#(`ClintBase, clk, reset) _temp(ifc);
    return ifc;
  endmodule:mkclint
  (*synthesize*)
  module mkdebug_loop(Ifc_debug_loop_apb#(`paddr, 32, USERSPACE));
  	let clk <-exposeCurrentClock;
  	let reset <-exposeCurrentReset;
    let ifc();
    mkdebug_loop_apb#(`DebugBase, clk, reset) _temp(ifc);
    return ifc;
  endmodule:mkdebug_loop
  (*synthesize*)
  module mkbootrom(Ifc_rom_axi4#(IDWIDTH, `paddr, ELEN, USERSPACE, 8192, ELEN, 1));
  	let clk <-exposeCurrentClock;
  	let reset <-exposeCurrentReset;
    let ifc();
    mk_rom_axi4#(`BootRomBase, replicate("boot.mem")) _temp(ifc);
    return ifc;
  endmodule:mkbootrom
  (*synthesize*)
  module mkbram(Ifc_ram2rw_axi4#(IDWIDTH, `paddr, ELEN, USERSPACE, 4194304, ELEN, 1));
  	let clk <-exposeCurrentClock;
  	let reset <-exposeCurrentReset;
    let ifc();
    mk_ram2rw_axi4#(`MemoryBase, replicate(tagged File "code.mem"),"nc") _temp(ifc);
    return ifc;
  endmodule:mkbram

  (*synthesize*)
  module mkaxi2apb_bridge(Ifc_axi2apb#(IDWIDTH, `paddr, ELEN, `paddr, 32, USERSPACE));
    let ifc();
    mkaxi2apb _temp(ifc);
    return ifc();
  endmodule:mkaxi2apb_bridge

  (*synthesize*)
  module mkaes(Ifc_aes_axi4#(IDWIDTH, `paddr, ELEN, USERSPACE, 16));
  	let clk <-exposeCurrentClock;
  	let reset <-exposeCurrentReset;
    let ifc();
    mkaes_axi4#(4,4,`AESBase,clk, reset) _temp(ifc);
    return ifc();
  endmodule:mkaes
  (*synthesize*)
  module mkecc(Ifc_ecc_axi4#(IDWIDTH, `paddr, ELEN, USERSPACE));
    let clk <-exposeCurrentClock;
    let reset <-exposeCurrentReset;
    let ifc();
    mkecc_axi4#(`ECCBase,clk, reset) _temp(ifc);
    return ifc();
  endmodule:mkecc
endpackage
