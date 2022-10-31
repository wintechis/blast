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
    // remove highlightblock functions from the js code tab
    code = code.replace(/highlightBlock\('.*'\);\n/gm, '');
    // remove 'if (interpreterExecutionExit === true) return();\n' from the js code tabs.
    code = code.replace(
      /if \(interpreterExecutionExit === true\) return;\n/gm,
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
