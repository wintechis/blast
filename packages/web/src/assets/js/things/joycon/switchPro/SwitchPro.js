import JoyStick from './JoyStick.js';

const BUTTON_MAPPING = {
  0: 'B',
  1: 'A',
  2: 'Y',
  3: 'X',
  4: 'L',
  5: 'R',
  6: 'ZL',
  7: 'ZR',
  8: 'MINUS',
  9: 'PLUS',
  10: 'LS',
  11: 'RS',
  12: 'UP',
  13: 'DOWN',
  14: 'LEFT',
  15: 'RIGHT',
  16: 'HOME',
  17: 'CAPTURE',
};

export default class SwitchPro {
  constructor() {
    this.prevPressed = {};
    this.pressed = {};
    this.listeners = [];
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

  _emit() {
    this.listeners.forEach(fn => fn(this.pressed));
  }

  pollGamepads() {
    const gp = this._getGamepad();
    if (!gp) {
      return;
    }

    // keep track of previous iteration to know if we need to emit changes
    this.prevPressed = this.pressed;
    this.pressed = {};

    for (let i = 0, j = gp.buttons.length; i < j; i++) {
      if (gp.buttons[i].pressed) {
        const button = BUTTON_MAPPING[i];
        this.pressed[button] = 1;
      }
    }

    const leftStick = new JoyStick('LS', gp.axes[0], gp.axes[1]);
    // const rightStick = new JoyStick('RS', gp.axes[2], gp.axes[3]);

    this.pressed = {
      ...this.pressed,
      ...leftStick.pressValues(),
      // ...rightStick.pressValues(),
    };

    // only emit if somethign changed
    if (!this._shallowEqual(this.prevPressed, this.pressed)) {
      this._emit();
    }
  }

  // get reference to the gamepad
  _getGamepad() {
    const gps = navigator.getGamepads ? navigator.getGamepads() : [];
    if (gps.length === 0 || !Array.from(gps).some(gp => !!gp)) {
      return;
    }

    // the gamepad shows up twice when connected via bluetooth
    //   0: Pro Controller (STANDARD GAMEPAD)
    //   1: Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)
    // we want the one with more buttons mapped
    return Array.from(gps).find(gp => {
      if (gp.buttons) {
        return gp.buttons.length === 18;
      }
    });
  }

  _shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }
}
