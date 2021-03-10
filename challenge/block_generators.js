Blockly.JavaScript['robot'] = function(block) {
  const box = block.getFieldValue('box');
  const code = '["bot", "' + box + '"],';
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
  const solution = Blockly.JavaScript.statementToCode(block, 'solution');

  const solutionJSON = `{"${name}": [${solution}]}`;

  const code = `submitSolution(${challenge}, ${solutionJSON})`;
  return code;
};

const submitSolution = function(challenge, solution, callback) {
  const uri = 'https://referee.rapidthings.eu/challenge/' + challenge;
  console.log(uri);
  const headers = JSON.parse('{"Content-Type": "application/json"}');
  const requestOptions = {
    method: 'POST',
    headers: new Headers(headers),
    body: solution,
  };


  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        return res.text();
      })
      .then((resData) => {
        console.log(resData);
        callback();
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};
