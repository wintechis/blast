/**
 * @fileoverview Blast test cases testing the sample files.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

suite('samples', function() {
  test('xml', function() {
    const schema = fs.readFileSync('blockly.xsd');
    fs.readdirSync('samples/').forEach((sample) => {
      const xml = fs.readFileSync('samples/' + sample);
    });
  });
});
