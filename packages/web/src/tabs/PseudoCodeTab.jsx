import React from 'react';
import Blockly from 'blockly';
import PropTypes from 'prop-types';

import SyntaxHighlighter from 'react-syntax-highlighter';

const {ASTNode, constants, BlockSvg, WorkspaceSvg} = Blockly;

/**
 * Converts the workspace to a pseudo code string.
 * @param {string=} opt_emptyToken The placeholder string used to denote an
 *     empty field. If not specified, '?' is used.
 * @return {string} The pseudo code string.
 */
BlockSvg.prototype.toPseudoCode = function (opt_emptyToken) {
  let pseudo = [];
  const emptyFieldPlaceholder = opt_emptyToken || '?';

  // Temporarily set flag to navigate to all fields.
  const prevNavigateFields = ASTNode.NAVIGATE_ALL_FIELDS;
  ASTNode.NAVIGATE_ALL_FIELDS = true;

  let node = ASTNode.createBlockNode(this);

  /**
   * Whether or not to add parentheses around an input.
   * @param {!Connection} connection The connection.
   * @return {boolean} True if we should add parentheses around the input.
   */
  function shouldAddParentheses(connection) {
    let checks = connection.getCheck();
    if (!checks && connection.targetConnection) {
      checks = connection.targetConnection.getCheck();
    }
    return (
      !!checks &&
      (checks.indexOf('Boolean') !== -1 || checks.indexOf('Number') !== -1)
    );
  }

  let scopeDepth = 0;
  // Traverse the AST building up our text string.
  while (node) {
    switch (node.getType()) {
      case ASTNode.types.INPUT: {
        const connection = /** @type {!Connection} */ (node.getLocation());
        if (!node.in()) {
          pseudo.push(emptyFieldPlaceholder);
        } else if (shouldAddParentheses(connection)) {
          pseudo.push('(');
        }
        if (connection.type === 3) {
          pseudo.push('{\n');
          scopeDepth++;
        }
        break;
      }
      case ASTNode.types.FIELD: {
        const field = /** @type {Field} */ (node.getLocation());
        if (field.name !== constants.COLLAPSED_FIELD_NAME) {
          pseudo.push(field.getText());
        }
        break;
      }
    }

    const current = node;
    if (current.getType() === ASTNode.types.NEXT) {
      pseudo.push('\n');
    }
    node = current.in() || current.next();

    if (!node) {
      // Can't go in or next, keep going out until we can go next.
      node = current.out();
      while (node && !node.next()) {
        node = node.out();
        // If we hit an input on the way up, possibly close out parentheses.
        if (node && node.getType() === ASTNode.types.INPUT) {
          const connection = /** @type {!Connection} */ (node.getLocation());
          if (shouldAddParentheses(connection)) {
            pseudo.push(')');
          }
        }
        if (node && node.getType() === ASTNode.types.BLOCK) {
          if (current.getType() === ASTNode.types.NEXT) {
            pseudo.push('}');
            scopeDepth--;
          }
        }
      }
      if (node) {
        node = node.next();
      }
    }
  }

  // Restore state of NAVIGATE_ALL_FIELDS.
  ASTNode.NAVIGATE_ALL_FIELDS = prevNavigateFields;

  // Run through our text array and simplify expression to remove parentheses
  // around single field blocks.
  // E.g. ['repeat', '(', '10', ')', 'times', 'do', '?']
  for (let i = 2; i < pseudo.length; i++) {
    if (pseudo[i - 2] === '(' && pseudo[i] === ')') {
      pseudo[i - 2] = pseudo[i - 1];
      pseudo.splice(i - 1, 2);
    }
  }

  // Join the text array, removing spaces around added parentheses.
  pseudo = pseudo.reduce((acc, value) => {
    return acc + (acc.substr(-1) === '(' || value === ')' ? '' : ' ') + value;
  }, '');
  pseudo = pseudo.trim() || '???';

  while (scopeDepth--) {
    pseudo += '}';
  }

  return pseudo;
};

WorkspaceSvg.prototype.toPseudoCode = function (opt_emptyToken) {
  return this.getTopBlocks()
    .map(block => block.toPseudoCode(opt_emptyToken))
    .join('\n');
};

export default class PseudoCodeTab extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    workspace: PropTypes.object,
  };

  render() {
    return (
      <SyntaxHighlighter
        language="javascript"
        showLineNumbers={true}
        customStyle={{margin: 0, width: '100%'}}
      >
        {this.props.workspace !== null
          ? this.props.workspace.toPseudoCode()
          : ''}
      </SyntaxHighlighter>
    );
  }
}
