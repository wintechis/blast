declare module 'joy-con-webhid' {
  interface Axis {
    x: number;
    y: number;
    z: number;
  }
  interface Quaternion extends Axis {
    w: number;
  }
  interface StatusWithHex {
    _raw?: Uint8Array;
    _hex?: Uint8Array;
  }
  interface Version {
    major: number;
    minor: number;
  }
  interface DeviceInfo extends StatusWithHex {
    firmwareVersion: Version;
    type: string | undefined;
    macAddress: string;
    spiColorInUse: boolean;
  }
  interface BatteryLevel extends StatusWithHex {
    level: string;
  }
  interface AnalogStick extends StatusWithHex {
    horizontal: string;
    vertical: string;
  }
  interface Acceleration extends StatusWithHex {
    acc: number;
  }
  interface Accelerometer {
    x: Acceleration;
    y: Acceleration;
    z: Acceleration;
  }
  interface Gyroscope extends StatusWithHex {
    dps: number;
    rps: number;
  }
  interface EulerAngles {
    alpha: string;
    beta: string;
    gamma: string;
  }
  interface ButtonStatus extends StatusWithHex {
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
  /**
   * Applies a complementary filter to obtain Euler angles from gyroscope and
   * accelerometer data.
   *
   * @export
   * @param {*} gyroscope
   * @param {*} accelerometer
   * @param {*} productId
   * @return {Object}
   */
  declare function toEulerAngles(
    gyroscope: Axis,
    accelerometer: Axis,
    productId: number
  ): EulerAngles | undefined;
  declare function toEulerAnglesQuaternion(q: Quaternion): EulerAngles;
  declare function toQuaternion(
    gyro: Axis,
    accl: Axis,
    productId: number
  ): Quaternion;
  declare function parseDeviceInfo(rawData: Uint8Array): DeviceInfo;
  declare function parseInputReportID(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseTimer(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseBatteryLevel(
    rawData: Uint8Array,
    data: Uint8Array
  ): BatteryLevel;
  declare function parseConnectionInfo(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseButtonStatus(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseCompleteButtonStatus(
    rawData: Uint8Array,
    data: Uint8Array
  ): ButtonStatus;
  declare function parseAnalogStick(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseAnalogStickLeft(
    rawData: Uint8Array,
    data: Uint8Array
  ): AnalogStick;
  declare function parseAnalogStickRight(
    rawData: Uint8Array,
    data: Uint8Array
  ): AnalogStick;
  declare function parseFilter(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseVibrator(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseAck(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseSubcommandID(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseSubcommandReplyData(
    rawData: Uint8Array,
    data: Uint8Array
  ): StatusWithHex;
  declare function parseAccelerometers(
    rawData: Uint8Array,
    data: Uint8Array
  ): Accelerometer[];
  declare function parseGyroscopes(
    rawData: Uint8Array,
    data: Uint8Array
  ): Gyroscope[][];
  declare function calculateActualAccelerometer(accelerometers: number[][]): {
    x: number;
    y: number;
    z: number;
  };
  declare function calculateActualGyroscope(gyroscopes: number[][]): {
    x: number;
    y: number;
    z: number;
  };

  /// <reference types="w3c-web-hid" />
  import type {
    Accelerometer,
    AnalogStick,
    Axis,
    BatteryLevel,
    ButtonStatus,
    DeviceInfo,
    EulerAngles,
    Gyroscope,
    Quaternion,
    StatusWithHex,
  } from './parse';
  declare type BatteryLevelEvent = CustomEvent<BatteryLevel>;
  declare type DeviceInfoEvent = CustomEvent<DeviceInfo>;
  declare type HIDInputEvent = CustomEvent<Packet>;
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
  interface CustomEventMap {
    deviceinfo: DeviceInfoEvent;
    batterylevel: BatteryLevelEvent;
    hidinput: HIDInputEvent;
  }
  declare global {
    export interface EventTarget {
      addEventListener<K extends keyof CustomEventMap>(
        type: K,
        handler: (event: CustomEventMap[K]) => void
      ): void;
      removeEventListener<K extends keyof CustomEventMap>(
        type: K,
        handler: (event: CustomEventMap[K]) => void
      ): void;
    }
  }
  /**
   *
   *
   * @class JoyCon
   * @extends {EventTarget}
   */
  declare class JoyCon extends EventTarget {
    private device;
    inputReport;
    /**
     * Creates an instance of JoyCon.
     * @param {HIDDevice} device
     * @memberof JoyCon
     */
    constructor(device: HIDDevice);
    /**
     * Device opened status.
     */
    get opened(): boolean | undefined;
    /**
     * Opens the device.
     *
     * @memberof JoyCon
     */
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * Requests information about the device.
     *
     * @memberof JoyCon
     */
    getRequestDeviceInfo(): Promise<DeviceInfo>;
    /**
     * Requests information about the battery.
     *
     * @memberof JoyCon
     */
    getBatteryLevel(): Promise<BatteryLevel>;
    /**
     * Enables simple HID mode.
     *
     * @memberof JoyCon
     */
    enableSimpleHIDMode(): Promise<void>;
    /**
     * Enables standard full mode.
     *
     * @memberof JoyCon
     */
    enableStandardFullMode(): Promise<void>;
    /**
     * Enables EMU mode.
     *
     * @memberof JoyCon
     */
    enableIMUMode(): Promise<void>;
    /**
     * Disables IMU mode.
     *
     * @memberof JoyCon
     */
    disableIMUMode(): Promise<void>;
    /**
     * Enables vibration.
     *
     * @memberof JoyCon
     */
    enableVibration(): Promise<void>;
    /**
     * Disables vibration.
     *
     * @memberof JoyCon
     */
    disableVibration(): Promise<void>;
    /**
     * Send a rumble signal to Joy-Con.
     *
     * @param {number} lowFrequency
     * @param {number} highFrequency
     * @param {number} amplitude
     *
     * @memberof JoyCon
     */
    rumble(
      lowFrequency: number,
      highFrequency: number,
      amplitude: number
    ): Promise<void>;
    /**
     * Deal with `oninputreport` events.
     *
     * @param {*} event
     * @memberof JoyCon
     */
    _onInputReport(event: HIDInputReportEvent): void;
    /**
     *
     *
     * @param {*} deviceInfo
     * @memberof JoyCon
     */
    _receiveDeviceInfo(deviceInfo: DeviceInfo): void;
    /**
     *
     *
     * @param {*} batteryLevel
     * @memberof JoyCon
     */
    _receiveBatteryLevel(batteryLevel: BatteryLevel): void;
    _receiveInputEvent(_packet: Packet): void;
  }
  /**
   *
   *
   * @class JoyConLeft
   * @extends {JoyCon}
   */
  declare class JoyConLeft extends JoyCon {
    /**
     * Creates an instance of JoyConLeft.
     * @param {HIDDevice} device
     * @memberof JoyConLeft
     */
    constructor(device: HIDDevice);
    /**
     *
     *
     * @param {*} packet
     * @memberof JoyConLeft
     */
    _receiveInputEvent(packet: Packet): void;
  }
  /**
   *
   *
   * @class JoyConRight
   * @extends {JoyCon}
   */
  declare class JoyConRight extends JoyCon {
    /**
     *Creates an instance of JoyConRight.
     * @param {HIDDevice} device
     * @memberof JoyConRight
     */
    constructor(device: HIDDevice);
    /**
     *
     *
     * @param {*} packet
     * @memberof JoyConRight
     */
    _receiveInputEvent(packet: Packet): void;
  }

  interface CustomEventMap {
    joyConConnect: CustomEvent<JoyCon>;
    joyConDisconnect: CustomEvent<number>;
  }
  declare global {
    function addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (event: CustomEventMap[K]) => void
    ): void;
    function removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (event: CustomEventMap[K]) => void
    ): void;
  }

  export {JoyConLeft, JoyConRight};
}
