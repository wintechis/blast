class JoyStick {
  constructor(type, horizAxis, vertAxis) {
    this.type = type;
    this.horizAxis = Math.round(horizAxis * 100) / 100;
    this.vertAxis = -1 * (Math.round(vertAxis * 100) / 100);
  }

  pressValues() {
    const pressed = {};

    pressed['x'] = this.horizAxis;
    pressed['y'] = this.vertAxis;
    // calculate angle
    let angle = (Math.atan2(this.horizAxis, this.vertAxis) / Math.PI) * 180;
    // vertAxis: -1 and horizAxis: 0 should be 0 degrees, horizAxis: 1 is 90 degrees
    // vertAxis: 1 and horizAxis: 0 should be 180 degrees, horizAxis: -1 is 270 degrees
    if (this.horizAxis < 0) {
      angle += 360;
    }
    pressed['angle'] = angle;

    console.log(pressed);

    return pressed;
  }
}

export default JoyStick;
