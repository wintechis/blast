Blockly.JavaScript['robot'] = function(block) {
  const box = block.getFieldValue('box');
  const code = '["bot", "' + box.toLowerCase() + '"],';
  return code;
};

Blockly.JavaScript['strip'] = function(block) {
  const color = block.getFieldValue('color');
  const code = '["strip", "' + color + '"],';
  return code;
};

Blockly.JavaScript['signal'] = function(block) {
  const color = block.getFieldValue('color');
  const code = '["signal", "' + color + '"],';
  return code;
};

Blockly.JavaScript['submit'] = function(block) {
  const challenge = Blockly.JavaScript.valueToCode(
      block,
      'challenge',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const name = block.getFieldValue('NAME');
  let solution = Blockly.JavaScript.statementToCode(block, 'solution');

  solution = solution.slice(0, -1);

  const solutionJSON = Blockly.JavaScript.quote_(
      `{"${name}": [${solution.replace(/highlightBlock\('.*'\);\n/gm, '')}]}`,
  );

  const code = `submitSolution(${challenge}, ${solutionJSON})`;
  return code;
};

const submitSolution = function(challenge, solution, callback) {
  const uri = 'https://referee.rapidthings.eu/challenge/' + challenge;
  const headers = JSON.parse('{"Content-Type": "application/json"}');
  console.log(solution);
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: solution,
  };

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        return res.text();
      })
      .then((resData) => {
        console.log(resData);
        if (resData == '') {
          Blast.BlockMethods.displayText(
              `Solution for challenge ${challenge} submitted.`,
          );
        } else {
          Blast.BlockMethods.displayText(resData);
        }
        callback();
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};
