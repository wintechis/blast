/**
 * @fileoverview Colour blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

goog.module('Blast.blocks.colours');

const {addBlock} = goog.require('Blast.Toolbox');

// Define inner block XML for the colour_rgb block.
const COLOUR_RGB_XML = `
<block type="colour_rgb">
    <value name="RED">
        <block type="math_number">
            <field name="NUM">100</field>
        </block>
    </value>
    <value name="GREEN">
        <block type="math_number">
            <field name="NUM">50</field>
        </block>
    </value>
    <value name="BLUE">
        <block type="math_number">
            <field name="NUM">0</field>
        </block>
    </value>
</block>`;

// Add the colour_rgb block to the toolbox.
addBlock('colour_rgb', 'colours', COLOUR_RGB_XML);

// Define inner block XML for the colur_blend block.
const COLOUR_BLEND_XML = `
<block type="colour_blend">
    <value name="COLOUR1">
        <block type="colour_picker">
            <field name="COLOUR">#ff0000</field>
        </block>
    </value>
    <value name="COLOUR2">
        <block type="colour_picker">
            <field name="COLOUR">#3333ff</field>
        </block>
    </value>
    <value name="RATIO">
        <block type="math_number">
            <field name="NUM">50</field>
        </block>
    </value>
</block>`;

// Add the colour_blend block to the toolbox.
addBlock('colour_blend', 'colours', COLOUR_BLEND_XML);
