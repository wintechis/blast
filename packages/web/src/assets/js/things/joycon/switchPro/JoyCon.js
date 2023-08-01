const buttonMappingSingle = {
  0: 'A',
  1: 'X',
  2: 'B',
  3: 'Y',
  4: 'RSL',
  5: 'RSR',
  9: 'PLUS',
  11: 'RA',
  12: 'HOME',
  14: 'R',
  15: 'RT',
  16: 'LEFT',
  17: 'DOWN',
  18: 'UP',
  19: 'RIGHT',
  20: 'LSL',
  21: 'LSR',
  24: 'MINUS',
  26: 'LA',
  29: 'CAPTURE',
  30: 'L',
  31: 'LT',
};

export default class JoyCon {
  constructor() {
    this.prevPressed = {};
    this.pressed = [];
    this.listeners = [];
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

  _emit() {
    this.listeners.forEach(fn => fn(this.pressed));
  }

  pollGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gamepadArray = Array.from(gamepads);
    const orderedGamepads = [];
    orderedGamepads.push(
      gamepadArray.find(g => g && g.id.indexOf('Joy-Con') > -1)
    );

    let type = orderedGamepads[0].id.indexOf('L+R') > -1 ? 'L+R' : 'L';
    type = orderedGamepads[0].id.indexOf('(R)') > -1 ? 'R' : type;

    const lastPressed = this.pressed;
    this.pressed = [];

    for (const gamepad of orderedGamepads) {
      if (gamepad) {
        for (let i = 0; i < gamepad.buttons.length; i++) {
          if (gamepad.buttons[i].pressed) {
            let id, button;
            if (type === 'R') {
              id = i;
              button = buttonMappingSingle[id] || id;
            } else if (type === 'L') {
              id = i + 16;
              button = buttonMappingSingle[id] || id;
            } else if (type === 'L+R') {
              id = i + 6;
              button = buttonMappingSingle[id] || id;
            }
            this.pressed.push(button);
          }
        }
      }
    }

    if (lastPressed !== this.pressed) {
      this._emit();
    }
  }
}
