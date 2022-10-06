/**
 * @fileoverview adds a slider to calibrate the sphero's heading
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {
  spheroIds,
  spheroInstances,
} from '../../core/dist/drivers/sphero/blocks.js';

export const addCalibrateButton = function () {
  const calibrateButton = document.getElementById('calibrateButton');
  if (!calibrateButton) {
    // create button
    const calibrateButton = document.createElement('button');
    calibrateButton.id = 'calibrateSpheroButton';
    calibrateButton.innerHTML = 'Calibrate Sphero';
    calibrateButton.onclick = toggleSlider;
    calibrateButton.style['background-color'] = '#888';
    calibrateButton.style.color = 'white';
    calibrateButton.style.font = 'normal 11pt sans-serif';
    calibrateButton.style['margin-top'] = '10px';
    calibrateButton.style.border = 'none';
    calibrateButton.onmouseover = function () {
      calibrateButton.style['background-color'] = '#aaa';
    };
    calibrateButton.onmouseout = function () {
      calibrateButton.style['background-color'] = '#888';
    };
    document.getElementById('devInfo').appendChild(calibrateButton);
  }
};

export const removeCalibrateButton = function () {
  const calibrateButton = document.getElementById('calibrateButton');
  if (calibrateButton) {
    calibrateButton.remove();
  }
};

let lastSetHeading = 0;
const setHeading = function (angle) {
  // only set heading every 100 ms
  if (Date.now() - lastSetHeading > 100) {
    lastSetHeading = Date.now();
    const selectedSphero = document.getElementById('selectSphero').value;
    const sphero = spheroInstances.get(selectedSphero);
    sphero.setHeading(angle);
  }
};

const toggleSlider = function () {
  // uses addSlider and removeSlider to add and remove the slider
  const slider = document.getElementById('sliderContainer');
  if (slider) {
    removeSlider();
  } else {
    addSlider();
  }
};

let lastSelectedSphero = null;
const addSlider = function () {
  // get toolbox width to position the slider's container next to it.
  const toolboxDiv = document.getElementsByClassName('blocklyToolboxDiv')[0];
  const toolboxWidth = toolboxDiv.offsetWidth;

  // create a container for the slider
  const sliderContainer = document.createElement('div');
  sliderContainer.id = 'sliderContainer';
  sliderContainer.style.position = 'absolute';
  sliderContainer.style.bottom = 10 + 'px';
  sliderContainer.style.left = toolboxWidth + 'px';
  sliderContainer.style.width = '250px';
  sliderContainer.style.height = '350px';
  sliderContainer.style.padding = '10px';
  sliderContainer.style.zIndex = '100';
  sliderContainer.style['background-color'] = 'white';
  sliderContainer.style.border = '1px solid grey';
  document.body.appendChild(sliderContainer);

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '0px';
  closeButton.style.right = '0px';
  closeButton.style.width = '20px';
  closeButton.style.height = '20px';
  closeButton.style['background-color'] = 'white';
  closeButton.style.border = 'none';
  closeButton.onclick = toggleSlider;
  sliderContainer.appendChild(closeButton);

  // Add instructions
  const instructions = document.createElement('p');
  instructions.innerHTML =
    "Drag the slider below, until the sphero's blue LED is pointing at you";
  instructions.style['text-align'] = 'center';
  sliderContainer.appendChild(instructions);

  // Add dropdown to select the sphero
  const selectSphero = document.createElement('select');
  selectSphero.id = 'selectSphero';

  // Add all spheros to the dropdown
  for (const [key, value] of spheroIds) {
    const option = document.createElement('option');
    option.value = value;
    option.text = key;
    selectSphero.appendChild(option);
  }
  sliderContainer.appendChild(selectSphero);

  // set selected sphero's leds when dropdown changes
  selectSphero.onchange = function () {
    if (lastSelectedSphero) {
      spheroInstances.get(lastSelectedSphero).setAllLeds(255, 255, 255);
    }
    const selectedSphero = document.getElementById('selectSphero').value;
    const sphero = spheroInstances.get(selectedSphero);
    sphero.setAllLeds(0, 0, 0);
    sphero.setLedsColor(0, 0, 255);
    lastSelectedSphero = selectedSphero;
  };

  // create the slider
  const sliderDiv = document.createElement('div');
  sliderDiv.id = 'slider';
  sliderDiv.style.width = '200px';
  sliderDiv.style.height = '200px';
  sliderDiv.style.position = 'relative';
  sliderDiv.style.margin = '25px auto auto auto';
  sliderContainer.appendChild(sliderDiv);
  const value = document.createElement('div');
  value.id = 'debug';
  value.className = 'debug';
  value.textContent = '0°';
  const sliderCircle = document.createElement('div');
  sliderCircle.id = 'circle';
  sliderCircle.className = 'circle';
  const sliderDot = document.createElement('div');
  sliderDot.id = 'dot';
  sliderDot.className = 'dot';
  sliderDiv.appendChild(value);
  sliderDiv.appendChild(sliderCircle);
  sliderCircle.appendChild(sliderDot);

  const selectedSphero = document.getElementById('selectSphero').value;
  const sphero = spheroInstances.get(selectedSphero);
  sphero.setAllLeds(0, 0, 0);
  sphero.setBackLedIntensity(255);

  radial_input();
};

const removeSlider = function () {
  // change sphero's leds back to normal
  if (!lastSelectedSphero) {
    lastSelectedSphero = document.getElementById('selectSphero').value;
  }
  spheroInstances.get(lastSelectedSphero).setAllLeds(255, 255, 255);
  // remove slider
  const sliderContainer = document.getElementById('sliderContainer');
  sliderContainer.parentNode.removeChild(sliderContainer);
};

function setTransform(element, angle) {
  const transfromString = 'rotate(' + angle + '° )';
  // now attach that variable to each prefixed style
  element.style.webkitTransform = transfromString;
  element.style.MozTransform = transfromString;
  element.style.msTransform = transfromString;
  element.style.OTransform = transfromString;
  element.style.transform = transfromString;
}

function radial_input() {
  let is_dragging;
  is_dragging = false;

  const circle = document.getElementById('circle');
  const dot = document.getElementById('dot');
  const degrees = document.getElementById('debug');

  circle.addEventListener(
    'mousedown',
    e => {
      is_dragging = true;
    },
    false
  );
  circle.addEventListener(
    'touchstart',
    e => {
      is_dragging = true;
    },
    false
  );
  document.addEventListener(
    'mouseup',
    e => {
      is_dragging = false;
    },
    false
  );
  document.addEventListener(
    'touchend',
    e => {
      is_dragging = false;
    },
    false
  );
  function draw(e) {
    let angle, center_x, center_y, delta_x, delta_y, pos_x, pos_y, touch;
    if (is_dragging) {
      touch = void 0;
      if (e.touches) {
        touch = e.touches[0];
      }
      center_x = circle.offsetWidth / 2 + circle.getBoundingClientRect().left;
      center_y = circle.offsetHeight / 2 + circle.getBoundingClientRect().top;

      pos_x = e.pageX || touch.pageX;
      pos_y = e.pageY || touch.pageY;
      delta_y = center_y - pos_y;
      delta_x = center_x - pos_x;
      // Calculate Angle between circle center and mouse pos
      angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI);
      angle -= 90;
      if (angle < 0) {
        // Always show angle positive
        angle = 360 + angle;
      }
      angle = Math.round(angle);
      setTransform(dot, angle);
      setHeading(angle);
      degrees.textContent = angle + '°';
    }
  }
  document.addEventListener('mousemove', draw);
  document.addEventListener('touchmove', draw);
}
