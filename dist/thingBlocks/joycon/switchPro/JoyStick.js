class JoyStick {
  constructor(type, horizAxis, vertAxis) {
    this.type = type;
    this.horizAxis = horizAxis;
    this.vertAxis = vertAxis;

    this.values = {
      up: vertAxis < 0 && Math.round((vertAxis / -1) * 100) / 100,
      down: vertAxis > 0 && Math.round((vertAxis / 1) * 100) / 100,
      left: horizAxis < 0 && Math.round((horizAxis / -1) * 100) / 100,
      right: horizAxis > 0 && Math.round((horizAxis / 1) * 100) / 100,
    };
  }

  pressValues() {
    const pressed = {};

    const directions = ['up', 'down', 'left', 'right'];
    directions.forEach(dir => {
      if (this.values[dir] > 0) {
        const key = `${this.type}-${dir.toUpperCase()}`;
        pressed[key] = this.values[dir];
      }
    });

    return pressed;
  }
}

export default JoyStick;
