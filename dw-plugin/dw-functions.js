/**
 * @fileoverview DW plugin for Blast,
 * adds functions commonly used in the DW Project.
 * @author derwehr@gmail.com (Thomas Wehr)
 */
'use strict';

/**
 * Namespace for the DW plugin.
 */
Blast.DW = {};

/**
 * Workspace for the DW functions.
 */
Blast.DW.workspace = null;

/**
 * XML for the DW function blocks.
 */
const dwBlocks =
  '<xml><variables><variable id="zUnqAV]GX9*X;yV{+Uhx">mac</variable><variable id="Iv+nd1#p2IyBf=T,vfzj">host</variable><variable id="^r7(~uSh*cfuF~EmutCw">deviceUri</variable><variable id="t||]jaN*F%[Q,vucCbeA">connection status</variable></variables><block type="procedures_defnoreturn" id="I#Uxga;G3[~[uEU19VrU" x="10" y="10"><mutation><arg name="mac" varid="zUnqAV]GX9*X;yV{+Uhx"></arg><arg name="host" varid="Iv+nd1#p2IyBf=T,vfzj"></arg></mutation><field name="NAME">establish connection</field><comment pinned="false" h="80" w="160">connects bluetooth device with mac to the sc-ble-adapter at url</comment><statement name="STACK"><block type="controls_if" id="Q}fu30qnu:s!tIJ@U`@#"><value name="IF0"><block type="logic_compare" id="@~7htaGyCM^8PPSo]|ZB"><field name="OP">EQ</field><value name="A"><block type="text_charAt" id="%Vw4~yxzLpyZzm~kfaiq"><mutation at="false"></mutation><field name="WHERE">LAST</field><value name="VALUE"><block type="variables_get" id="uaSh-Y7?3t!;26Y|_12U"><field name="VAR" id="Iv+nd1#p2IyBf=T,vfzj">host</field></block></value></block></value><value name="B"><block type="text" id="@he).FOTx#Wz-LH+#CIg"><field name="TEXT">/</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="6Y9Sp*}Mp$HP|R/6np8P"><field name="VAR" id="Iv+nd1#p2IyBf=T,vfzj">host</field><value name="VALUE"><block type="text_getSubstring" id="Vt1RdC?~!9Fy2.$y[$=4"><mutation at1="false" at2="true"></mutation><field name="WHERE1">FIRST</field><field name="WHERE2">FROM_END</field><value name="STRING"><block type="variables_get" id=".r2Xy8=^p(N~!g!{[2Sm"><field name="VAR" id="Iv+nd1#p2IyBf=T,vfzj">host</field></block></value><value name="AT2"><block type="math_number" id="1rtiGvW_DJM(=51!^o0N"><field name="NUM">2</field></block></value></block></value></block></statement><next><block type="variables_set" id="D*f:NslR^44(`#8y(K^x"><field name="VAR" id="^r7(~uSh*cfuF~EmutCw">deviceUri</field><value name="VALUE"><block type="text_join" id="+.)sEn)?OVrg(GW_3.k:"><mutation items="4"></mutation><value name="ADD0"><block type="variables_get" id="*;)t^/?K}-[jnV@9O=eE"><field name="VAR" id="Iv+nd1#p2IyBf=T,vfzj">host</field></block></value><value name="ADD1"><block type="text" id="==hS+6;6j-A7cfSh:M8/"><field name="TEXT">/devices/</field></block></value><value name="ADD2"><block type="variables_get" id="VfQ1R5AXA~%yKK:[TWIv"><field name="VAR" id="zUnqAV]GX9*X;yV{+Uhx">mac</field></block></value><value name="ADD3"><block type="text" id="8o+e)Zl|*O.NvTAk`O7G"><field name="TEXT">/instruction</field></block></value></block></value><next><block type="variables_set" id=":ls9)}Qj}qY_/~e6@@e)"><field name="VAR" id="t||]jaN*F%[Q,vucCbeA">connection status</field><value name="VALUE"><block type="http_request" id="oWR)gVQ2eQK$Y:NP.Lw?"><field name="OUTPUT">status</field><field name="METHOD">PUT</field><field name="HEADERS">"Content-Type": "application/json"</field><field name="BODY">{"type": "ble:Connect"}</field><value name="uri"><block type="variables_get" id="dn4o;]g^aMLRP-rwX8!z"><field name="VAR" id="^r7(~uSh*cfuF~EmutCw">deviceUri</field></block></value></block></value><next><block type="controls_if" id="7:Xj^TGChe7/UL-xEAVg"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="!.I44utdOp)hY3-6;Y6]"><field name="OP">EQ</field><value name="A"><block type="variables_get" id="q+Q3,Wqdse9}(2=ZYx^B"><field name="VAR" id="t||]jaN*F%[Q,vucCbeA">connection status</field></block></value><value name="B"><block type="text" id="9_xZ4Qj[.l^^[`9Ge6f/"><field name="TEXT">200</field></block></value></block></value><statement name="DO0"><block type="display_text" id="G1kvVwu9{,Uc:5h=*9]K"><value name="text"><block type="text_join" id="(9D_)/Ic?8/tWTcYihcK"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="jb=lLzqzIT|C`zm?il)M"><field name="TEXT">connected to </field></block></value><value name="ADD1"><block type="variables_get" id="xJ+RvsQvFt2?]Pp-SeC+"><field name="VAR" id="zUnqAV]GX9*X;yV{+Uhx">mac</field></block></value></block></value></block></statement><statement name="ELSE"><block type="display_text" id="|J16.;2F:oRH$Qrq^@:o"><value name="text"><block type="text_join" id="V6)h(d~qB-HO_rwahPZh"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="~7q/.3D?S](Xm*gXivpt"><field name="TEXT">Connecting failed, Error Code:</field></block></value><value name="ADD1"><block type="variables_get" id="IK-wq{!p487R2i-GI[w="><field name="VAR" id="t||]jaN*F%[Q,vucCbeA">connection status</field></block></value></block></value></block></statement></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="+8xkbf(:s:D4Vt`_EE6;" x="13" y="613"><mutation><arg name="mac" varid="zUnqAV]GX9*X;yV{+Uhx"></arg><arg name="host" varid="Iv+nd1#p2IyBf=T,vfzj"></arg></mutation><field name="NAME">disconnect</field><comment pinned="false" h="80" w="160">disconnects bluetooth device with mac from the sc-ble-adapter at url</comment><statement name="STACK"><block type="controls_if" id="j4Nq{8}S^F)^G`9YSZ.y"><value name="IF0"><block type="logic_compare" id=")k=.YpIP#+U}IBDqy{/;"><field name="OP">EQ</field><value name="A"><block type="text_charAt" id="7!.pzvS|.J%aLC1wr./}"><mutation at="false"></mutation><field name="WHERE">LAST</field><value name="VALUE"><block type="variables_get" id="`E6hZE7_ne:(Hg|4y=cl"><field name="VAR" id="Iv+nd1#p2IyBf=T,vfzj">host</field></block></value></block></value><value name="B"><block type="text" id="[:,,Mx`oAYW][d.]9etz"><field name="TEXT">/</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="iwixq$vApqE0E=n2n|M5"><field name="VAR" id="Iv+nd1#p2IyBf=T,vfzj">host</field><value name="VALUE"><block type="text_getSubstring" id="c)]rCm6P^2nU9VzMhDjV"><mutation at1="false" at2="true"></mutation><field name="WHERE1">FIRST</field><field name="WHERE2">FROM_END</field><value name="STRING"><block type="variables_get" id="gOQc{uXRueQ^/ErT-pHR"><field name="VAR" id="Iv+nd1#p2IyBf=T,vfzj">host</field></block></value><value name="AT2"><block type="math_number" id="s$*bCWdt(2%x$)SxsgZ8"><field name="NUM">2</field></block></value></block></value></block></statement><next><block type="variables_set" id=":-iQMk=~3C|gKS8,*]Ia"><field name="VAR" id="^r7(~uSh*cfuF~EmutCw">deviceUri</field><value name="VALUE"><block type="text_join" id="JvcKt)OI/0ji(!$ld/hj"><mutation items="4"></mutation><value name="ADD0"><block type="variables_get" id="aR/*X96[$AvB%-MK#6Ne"><field name="VAR" id="Iv+nd1#p2IyBf=T,vfzj">host</field></block></value><value name="ADD1"><block type="text" id="_.X]^%}4YmCn0cU#{s4#"><field name="TEXT">/devices/</field></block></value><value name="ADD2"><block type="variables_get" id="ccty6dtWh9bdOi4eD,z7"><field name="VAR" id="zUnqAV]GX9*X;yV{+Uhx">mac</field></block></value><value name="ADD3"><block type="text" id="S4D)nSI?3o?RgQ6-ZsMi"><field name="TEXT">/instruction</field></block></value></block></value><next><block type="variables_set" id="lz/tk?Qaa,k0(/2!iB|$"><field name="VAR" id="t||]jaN*F%[Q,vucCbeA">connection status</field><value name="VALUE"><block type="http_request" id="#6x]mB4jh5Q^j9hN{vA["><field name="OUTPUT">status</field><field name="METHOD">PUT</field><field name="HEADERS">"Content-Type": "application/json"</field><field name="BODY">{"type": "ble:Disconnect"}</field><value name="uri"><block type="variables_get" id="KG_[$.8GR*l(^F1tFHAf"><field name="VAR" id="^r7(~uSh*cfuF~EmutCw">deviceUri</field></block></value></block></value><next><block type="controls_if" id="YCD$z@281@c0ug1KLZof"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="hmNM$CZQ.Ni]I^M/o={T"><field name="OP">EQ</field><value name="A"><block type="variables_get" id="sfuOs^xa}ip~?@m7U6SW"><field name="VAR" id="t||]jaN*F%[Q,vucCbeA">connection status</field></block></value><value name="B"><block type="text" id="BXFcB8x_=8ig,E2$/|2Q"><field name="TEXT">200</field></block></value></block></value><statement name="DO0"><block type="display_text" id="`e2E.|IuP6Kom@lf=%-p"><value name="text"><block type="text_join" id="|B(CG[b=)u5dGB_kM-V-"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="Q9q}Nfsxrf[egQOm=1=E"><field name="TEXT">disconnected from </field></block></value><value name="ADD1"><block type="variables_get" id="U3X5wQK=7nl(KY]WaeJr"><field name="VAR" id="zUnqAV]GX9*X;yV{+Uhx">mac</field></block></value></block></value></block></statement><statement name="ELSE"><block type="display_text" id="w|vHi=:#EwBRKAN3RF$w"><value name="text"><block type="text_join" id="hDU=Dv;CPZ,9ws-z%-k!"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="b0?4)awW|qB)%HB8NdB2"><field name="TEXT">Disconnecting failed, Error Code:</field></block></value><value name="ADD1"><block type="variables_get" id="_rhUZ4!H9j4[zzRIj_3t"><field name="VAR" id="t||]jaN*F%[Q,vucCbeA">connection status</field></block></value></block></value></block></statement></block></next></block></next></block></next></block></statement></block></xml>';

/**
 * Adds the DW Tab to the Tabrow
 * @private
 */
Blast.DW.addDWTab_ = function() {
  // highjack load button td
  const dwTabTd = document.getElementById('button_td');
  dwTabTd.id = 'tab_dw_functions';
  dwTabTd.classList.remove('tabmin');
  dwTabTd.classList.add('taboff');
  dwTabTd.innerHTML = '';
  dwTabTd.textContent = 'DW-functions';
  // Create content div for DW tab.
  const dwContentDiv = document.createElement('div');
  dwContentDiv.id = 'content_dw_functions';
  dwContentDiv.classList.add('content');
  // Add content div to the HTML DOM.
  document.body.appendChild(dwContentDiv);
  // Append DW tab TD to Blast Tabs list.
  Blast.TABS.push('dw_functions');
  // Add click listener to DW tab TD.
  Blast.bindClick(
      'tab_dw_functions',
      (function(name_) {
        return function() {
          Blast.tabClick(name_);
        };
      })('dw_functions'),
  );
  // Add workspace for DW functions.
  const container = document.getElementById('content_area');
  const onresize = function(e) {
    const bBox = Blast.getBBox_(container);
    for (let i = 0; i < Blast.TABS.length; i++) {
      const el = document.getElementById('content_' + Blast.TABS[i]);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = 2 * bBox.height - el.offsetHeight + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = 2 * bBox.width - el.offsetWidth + 'px';
    }
    // Make the 'workspace' tab line up with the toolbox.
    if (Blast.workspace && Blast.workspace.getToolbox().width) {
      document.getElementById('tab_workspace').style.minWidth =
        Blast.workspace.getToolbox().width - 38 + 'px';
      // Account for the 19 pixel margin and on each side.
    }
  };
  Blast.DW.workspace = Blockly.inject('content_dw_functions', {
    grid: {spacing: 25, length: 3, color: '#ddd', snap: true},
    media: 'media/',
    toolbox: dwToolbox,
    zoom: {controls: true, wheel: true},
  });
  // Load DW-functions into workspace.
  const xmlDom = Blockly.Xml.textToDom(dwBlocks);
  Blockly.Xml.domToWorkspace(xmlDom, Blast.DW.workspace);
  // Add DW-functions category.
  Blast.workspace.updateToolbox(dwToolbox);
  Blast.workspace.registerToolboxCategoryCallback(
      'DW',
      Blast.DW.dwFlyoutCallback,
  );
  // render workspace.
  onresize();
  Blockly.svgResize(Blast.DW.workspace);
  // Generate the code now, and upon future changes.
  Blast.generateCode();
  Blast.DW.workspace.addChangeListener(function(event) {
    if (!(event instanceof Blockly.Events.Ui)) {
      // Something changed. Parser needs to be reloaded.
      Blast.resetInterpreter();
      Blast.generateCode();
      Blast.renderContent();
    }
  });
  let successMessage = 'DW-functions loaded successfully.\n';
  successMessage += 'You can now find them in the DW category.\n';
  successMessage += 'To inspect or change them see the newly ';
  successMessage += 'created "DW-functions" tab.';
  Blockly.alert(successMessage);
};

/**
 * Switch the visible pane when a tab is clicked,
 * overriding to add DW workspace.
 * @param {string} clickedName Name of tab clicked.
 * @override
 */
Blast.tabClick = function(clickedName) {
  // Deselect all tabs and hide all panes.
  for (let i = 0; i < Blast.TABS.length; i++) {
    const name = Blast.TABS[i];
    const tab = document.getElementById('tab_' + name);
    tab.classList.add('taboff');
    tab.classList.remove('tabon');
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Blast.selected = clickedName;
  const selectedTab = document.getElementById('tab_' + clickedName);
  selectedTab.classList.remove('taboff');
  selectedTab.classList.add('tabon');
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
    'visible';
  Blockly.svgResize(Blast.workspace);
  if (Blast.DW.workspace != null) {
    Blockly.svgResize(Blast.DW.workspace);
  }
};

/**
 * Add a button to the Blast interface to load DW functions with.
 * @private
 */
Blast.DW.addLoadButton_ = function() {
  // spacer td for empty space between tabs.
  const spacerTd = document.createElement('td');
  spacerTd.classList.add('tabmin');
  spacerTd.innerHTML = '&nbsp;';
  // create td for the button.
  const buttonTd = document.createElement('td');
  buttonTd.id = 'button_td';
  buttonTd.classList.add('tabmin');
  // add button to the td.
  buttonTd.innerHTML = `
  <button id="load_dw_functions">
  <svg class="icon icon-folder-plus">
    <use xlink:href="media/symbol-defs.svg#icon-folder-plus"></use>
  </svg> DW-Functions</button>`;

  // insert new tds into tabRow.
  const tabRow = document.getElementById('tabRow');
  const inputsTd = document.getElementById('inputs_td');
  tabRow.insertBefore(buttonTd, inputsTd);
  tabRow.insertBefore(spacerTd, inputsTd);
};

/**
 * Generate JavaScript Code for the user's block-program,
 * overriding to include DW functions.
 * @override
 */
Blast.generateCode = function() {
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  // Generate JavaScript code and parse it.
  Blast.latestCode = '';
  if (Blast.DW != null && Blast.DW.workspace != null) {
    Blast.latestCode = Blockly.JavaScript.workspaceToCode(Blast.DW.workspace);
  }
  Blast.latestCode += Blockly.JavaScript.workspaceToCode(Blast.workspace);

  Blast.resetUi(Blast.status.READY);
};

/**
 * Initialize the DW plugin.
 */
Blast.DW.init = function() {
  // Add button to load DW tab
  Blast.DW.addLoadButton_();
  Blast.bindClick('load_dw_functions', Blast.DW.addDWTab_);
};

/**
 * Construct the blocks required by the flyout for the DW category.
 * @param {!Blockly.Workspace} workspace The workspace this flyout is for.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blast.DW.dwFlyoutCallback = function(workspace) {
  const xmlList = [];

  function populateProcedures(procedureList, templateName) {
    for (let i = 0; i < procedureList.length; i++) {
      const name = procedureList[i][0];
      const args = procedureList[i][1];
      // <block type="procedures_callnoreturn" gap="16">
      //   <mutation name="do something">
      //     <arg name="x"></arg>
      //   </mutation>
      // </block>
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', templateName);
      block.setAttribute('gap', 16);
      const mutation = Blockly.utils.xml.createElement('mutation');
      mutation.setAttribute('name', name);
      block.appendChild(mutation);
      for (let j = 0; j < args.length; j++) {
        const arg = Blockly.utils.xml.createElement('arg');
        arg.setAttribute('name', args[j]);
        mutation.appendChild(arg);
      }
      xmlList.push(block);
    }
  }

  const tuple = Blockly.Procedures.allProcedures(Blast.DW.workspace);
  populateProcedures(tuple[0], 'procedures_callnoreturn');
  populateProcedures(tuple[1], 'procedures_callreturn');
  return xmlList;
};

/**
 * Find the definition block for the named procedure,
 * overriding to check both the DW workspace and
 * the blast workspace for definitions
 * @param {string} name Name of procedure.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {Blockly.Block} The procedure definition block, or null not found.
 * @override
 */
Blockly.Procedures.getDefinition = function(name, workspace) {
  // Assume that a procedure definition is a top block.
  let blocks = workspace.getTopBlocks(false);
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].getProcedureDef) {
      const procedureBlock = /** @type {!Blockly.Procedures.ProcedureBlock} */ (blocks[
          i
      ]);
      const tuple = procedureBlock.getProcedureDef();
      if (tuple && Blockly.Names.equals(tuple[0], name)) {
        return blocks[i];
      }
    }
  }
  blocks = Blast.DW.workspace.getTopBlocks(false);
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].getProcedureDef) {
      const procedureBlock = /** @type {!Blockly.Procedures.ProcedureBlock} */ (blocks[
          i
      ]);
      const tuple = procedureBlock.getProcedureDef();
      if (tuple && Blockly.Names.equals(tuple[0], name)) {
        return blocks[i];
      }
    }
  }
  return null;
};

// initialize DW-plugin when page dom is loaded
window.addEventListener('load', Blast.DW.init);

const dwToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'loops_repeat'},
        {kind: 'BLOCK', type: 'loops_while_until'},
        {kind: 'BLOCK', type: 'loops_for'},
      ],
      name: 'Loops',
      colour: '120',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'http_request'},
        {kind: 'BLOCK', type: 'sparql_query'},
        {kind: 'BLOCK', type: 'sparql_ask'},
        {kind: 'BLOCK', type: 'display_text'},
        {kind: 'BLOCK', type: 'display_table'},
        {kind: 'BLOCK', type: 'table_cell'},
        {kind: 'BLOCK', type: 'switch_lights'},
        {kind: 'BLOCK', type: 'random_sound'},
        {kind: 'BLOCK', type: 'break_continue'},
        {kind: 'BLOCK', type: 'wait_seconds'},
      ],
      name: 'Actions',
      colour: '0',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'conditional_statement'},
        {kind: 'BLOCK', type: 'event'},
        {kind: 'BLOCK', type: 'logic_compare'},
        {kind: 'BLOCK', type: 'logic_operation'},
        {kind: 'BLOCK', type: 'logic_negate'},
      ],
      name: 'Conditions',
      colour: '210',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'uri'},
        {kind: 'BLOCK', type: 'mac'},
        {kind: 'BLOCK', type: 'text'},
        {kind: 'BLOCK', type: 'text_join'},
        {kind: 'BLOCK', type: 'text_length'},
        {kind: 'BLOCK', type: 'text_indexOf'},
        {kind: 'BLOCK', type: 'text_charAt'},
        {kind: 'BLOCK', type: 'text_getSubstring'},
        {kind: 'BLOCK', type: 'text_changeCase'},
        {kind: 'BLOCK', type: 'text_replace'},
      ],
      name: 'Text',
      colour: '160',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'number_value'},
        {kind: 'BLOCK', type: 'number_infinity'},
        {kind: 'BLOCK', type: 'number_arithmetic'},
        {kind: 'BLOCK', type: 'number_random'},
      ],
      name: 'Numbers',
      colour: '230',
    },
    {
      kind: 'CATEGORY',
      contents: [{kind: 'BLOCK', type: 'logic_boolean'}],
      name: 'Booleans',
      colour: '210',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Variables',
      custom: 'VARIABLE',
      colour: '330',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Functions',
      colour: '290',
      custom: 'PROCEDURE',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'DW',
      colour: '30',
      custom: 'DW',
    },
  ],
};
