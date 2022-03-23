export interface Axis {
    x: number;
    y: number;
    z: number;
}
export interface Quaternion extends Axis {
    w: number;
}
export interface StatusWithHex {
    _raw?: Uint8Array;
    _hex?: Uint8Array;
}
interface Version {
    major: number;
    minor: number;
}
export interface DeviceInfo extends StatusWithHex {
    firmwareVersion: Version;
    type: string | undefined;
    macAddress: string;
    spiColorInUse: boolean;
}
export interface BatteryLevel extends StatusWithHex {
    level: string;
}
export interface AnalogStick extends StatusWithHex {
    horizontal: string;
    vertical: string;
}
interface Acceleration extends StatusWithHex {
    acc: number;
}
export interface Accelerometer {
    x: Acceleration;
    y: Acceleration;
    z: Acceleration;
}
export interface Gyroscope extends StatusWithHex {
    dps: number;
    rps: number;
}
export interface EulerAngles {
    alpha: string;
    beta: string;
    gamma: string;
}
export interface ButtonStatus extends StatusWithHex {
    y: boolean;
    x: boolean;
    b: boolean;
    a: boolean;
    r: boolean;
    zr: boolean;
    down: boolean;
    up: boolean;
    right: boolean;
    left: boolean;
    l: boolean;
    zl: boolean;
    sr: boolean;
    sl: boolean;
    minus: boolean;
    plus: boolean;
    rightStick: boolean;
    leftStick: boolean;
    home: boolean;
    capture: boolean;
    chargingGrip: boolean;
}
export interface Packet {
    inputReportID?: StatusWithHex;
    buttonStatus?: Partial<ButtonStatus>;
    analogStick?: StatusWithHex;
    filter?: StatusWithHex;
    timer?: StatusWithHex;
    batteryLevel?: BatteryLevel;
    connectionInfo?: StatusWithHex;
    analogStickLeft?: AnalogStick;
    analogStickRight?: AnalogStick;
    vibrator?: StatusWithHex;
    ack?: StatusWithHex;
    subcommandID?: StatusWithHex;
    subcommandReplyData?: StatusWithHex;
    deviceInfo?: DeviceInfo;
    accelerometers?: Accelerometer[];
    gyroscopes?: Gyroscope[][];
    actualAccelerometer?: Axis;
    actualGyroscope?: {
        dps: Axis;
        rps: Axis;
    };
    actualOrientation?: EulerAngles;
    actualOrientationQuaternion?: EulerAngles;
    quaternion?: Quaternion;
}
export {};
