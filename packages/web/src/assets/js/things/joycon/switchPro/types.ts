export interface JoyConPacket {
  inputReportID: number;
  buttonStatus?: {
    a: boolean;
    b: boolean;
    x: boolean;
    y: boolean;
    plus: boolean;
    minus: boolean;
    home: boolean;
    capture: boolean;
    stickButtonL: boolean;
    stickButtonR: boolean;
    dpadLeft: boolean;
    dpadUp: boolean;
    dpadRight: boolean;
    dpadDown: boolean;
    sl: boolean;
    sr: boolean;
    l: boolean;
    zl: boolean;
    r: boolean;
    zr: boolean;
  };
  analogStick?: {
    stickX: number;
    stickY: number;
  };
  filter?: {
    filter: number;
  };
  timer?: {
    timer: number;
  };
  batteryLevel?: {
    level: number;
  };
  connectionInfo?: {
    connectionInfo: number;
  };
  analogStickLeft?: {
    stickX: number;
    stickY: number;
  };
  analogStickRight?: {
    stickX: number;
    stickY: number;
  };
  vibrator?: {
    vibrator: number;
  };
  ack?: {
    ack: number;
  };
  subcommandID?: {
    subcommandID: number;
  };
  subcommandReplyData?: {
    subcommandReplyData: number[];
  };
  deviceInfo?: {
    type: string;
    mac: string;
    color: string;
    serialNumber: string;
    firmwareVersion: string;
    hardwareVersion: string;
    joyConType: string;
  };
  accelerometers?: {
    x: {
      acc: number;
      calib: number;
    };
    y: {
      acc: number;
      calib: number;
    };
    z: {
      acc: number;
      calib: number;
    };
  }[];
  gyroscopes?: {
    x: {
      dps: number;
      rps: number;
      calib: number;
    };
    y: {
      dps: number;
      rps: number;
      calib: number;
    };
    z: {
      dps: number;
      rps: number;
      calib: number;
    };
  }[];
  actualAccelerometer?: {
    x: number;
    y: number;
    z: number;
  };
  actualGyroscope?: {
    dps: number[];
    rps: number[];
  };
  actualOrientation?: {
    pitch: number;
    roll: number;
    yaw: number;
  };
  actualOrientationQuaternion?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  quaternion?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  ringCon?: {
    ringCon: number;
  };
}
