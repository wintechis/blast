import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';

export default class JavascriptTab extends React.Component {
  constructor(props) {
    super(props);
  }

  cleanUpCode = code => {
    // The generators emit browser imports resolved against document.baseURI; for the
    // Node-flavoured listing shown in this tab, turn them back into plain specifiers.
    // replace 'const blastCore = await import(new URL('assets/blast/blast.browser.js', document.baseURI).href);'
    // with 'import * as blastCore from 'blast.node.js';'
    code = code.replace(
      /const blastCore = await import\(new URL\('assets\/blast\/blast\.browser\.js', document\.baseURI\)\.href\);/gm,
      "import * as blastCore from 'blast.node.js';"
    );

    // replace 'const blastTds = await import(new URL('assets/blast/blast.tds.js', document.baseURI).href);'
    // with 'import * as blastTds from 'blast.tds.js';'
    code = code.replace(
      /const blastTds = await import\(new URL\('assets\/blast\/blast\.tds\.js', document\.baseURI\)\.href\);/gm,
      "import * as blastTds from 'blast.tds.js';"
    );

    // remove highlightblock functions from the js code tab
    code = code.replace(/highlightBlock\(\\*'.*\\*'\);\\*\n/gm, '');
    // remove 'if (interpreterExecutionExit === true) {return;}\n' from the js code tabs.
    code = code.replace(
      /if \(interpreterExecutionExit === true\) {return;}\\*\n/gm,
      ''
    );
    return code;
  };

  render() {
    return (
      <SyntaxHighlighter
        language="javascript"
        showLineNumbers={true}
        customStyle={{margin: 0, width: '100%'}}
      >
        {this.cleanUpCode(this.props.code)}
      </SyntaxHighlighter>
    );
  }
}
