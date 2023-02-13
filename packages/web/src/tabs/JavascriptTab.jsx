import React from 'react';
import propTypes from 'prop-types';

import SyntaxHighlighter from 'react-syntax-highlighter';

export default class JavascriptTab extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    code: propTypes.string.isRequired,
  };

  cleanUpCode = code => {
    // replace 'const blastCore = await import('../../assets/blast/blast.web.js');'
    // with 'import * as blastCore from 'blast.node.js';'
    code = code.replace(
      /const blastCore = await import\('..\/..\/assets\/blast\/blast.web.js'\);/gm,
      "import * as blastCore from 'blast.node.js';"
    );

    // replace 'const blastTds = await import('../../assets/blast/blast.tds.js');'
    // with 'import * as blastTds from 'blast.tds.js';'
    code = code.replace(
      /const blastTds = await import\('..\/..\/assets\/blast\/blast.tds.js'\);/gm,
      "import * as blastTds from 'blast.tds.js';"
    );

    // // remove highlightblock functions from the js code tab
    // code = code.replace(/highlightBlock\(\\*'.*\\*'\);\\*\n/gm, '');
    // // remove 'if (interpreterExecutionExit === true) {return;}\n' from the js code tabs.
    // code = code.replace(
    //   /if \(interpreterExecutionExit === true\) {return;}\\*\n/gm,
    //   ''
    // );
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
