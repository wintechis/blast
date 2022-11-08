import Queue from './queue.js';
import {getDeviceById} from '../../../webBluetooth.js';

export const UUID_SPHERO_SERVICE = '00010001-574f-4f20-5370-6865726f2121';
export const UUID_SPHERO_SERVICE_INITIALIZE =
  '00020001-574f-4f20-5370-6865726f2121';

let bolt = null;

const APIV2_CHARACTERISTIC = '00010002-574f-4f20-5370-6865726f2121';
const ANTIDOS_CHARACTERISTIC = '00020005-574f-4f20-5370-6865726f2121';
const DFU_CONTROL_CHARACTERISTIC = '00020002-574f-4f20-5370-6865726f2121';
const DFU_INFO_CHARACTERISTIC = '00020004-574f-4f20-5370-6865726f2121';
const SUBS_CHARACTERISTIC = '00020003-574f-4f20-5370-6865726f2121';

const useTheForce = new Uint8Array([
  0x75, 0x73, 0x65, 0x74, 0x68, 0x65, 0x66, 0x6f, 0x72, 0x63, 0x65, 0x2e, 0x2e,
  0x2e, 0x62, 0x61, 0x6e, 0x64,
]);

const APIConstants = {
  escape: 171,
  startOfPacket: 141,
  endOfPacket: 216,
  escapeMask: 136,
  escapedEscape: 35,
  escapedStartOfPacket: 5,
  escapedEndOfPacket: 80,
};

const BatteryState = {
  notCharging: 1,
  charging: 2,
  charged: 3,
};

const ApiErrors = {
  success: 0,
  badDeviceId: 1,
  badCommandId: 2,
  notYetImplemented: 3,
  commandIsRestricted: 4,
  badDataLength: 5,
  commandFailed: 6,
  badParameterValue: 7,
  busy: 8,
  badTargetId: 9,
  targetUnavailable: 10,
  unknown: 255,
};

const Flags = {
  isResponse: 1,
  requestsResponse: 2,
  requestsOnlyErrorResponse: 4,
  resetsInactivityTimeout: 8,
  commandHasTargetId: 16,
  commandHasSourceId: 32,
};

const DeviceId = {
  apiProcessor: 16,
  systemInfo: 17,
  powerInfo: 19,
  driving: 22,
  sensor: 24,
  userIO: 26,
};

const DrivingCommandIds = {
  rawMotor: 1,
  driveAsRc: 2,
  driveAsSphero: 4,
  resetYaw: 6,
  driveWithHeading: 7,
  tankDrive: 8,
  stabilization: 12,
};

const PowerCommandIds = {
  deepSleep: 0,
  sleep: 1,
  batteryVoltage: 3,
  wake: 13,
  willSleepAsync: 25,
  sleepAsync: 26,
  batteryStateChange: 33,
};

const UserIOCommandIds = {
  playAudioFile: 7,
  audioVolume: 8,
  stopAudio: 10,
  testSound: 24,
  allLEDs: 14,
  setUserProfile: 35,
  matrixPixel: 45,
  matrixColor: 47,
  clearMatrix: 56,
  matrixRotation: 58,
  matrixScrollText: 59,
  matrixScrollNotification: 60,
  matrixLine: 61,
  matrixFill: 62,
  printChar: 66,
};

const SensorCommandIds = {
  sensorMask: 0,
  sensorResponse: 2,
  configureCollision: 17,
  collisionDetectedAsync: 18,
  resetLocator: 19,
  enableCollisionAsync: 20,
  sensor1: 15,
  sensor2: 23,
  sensorMaskExtented: 12,
  calibrateToNorth: 37,
  compassNotify: 38,
};

const SensorMaskValues = {
  off: 0,
  locator: 1,
  gyro: 2,
  orientation: 3,
  accelerometer: 4,
};

const SensorMask = {
  off: 0,
  velocityY: 1 << 3,
  velocityX: 1 << 4,
  locatorY: 1 << 5,
  locatorX: 1 << 6,

  gyroZFiltered: 1 << 23,
  gyroYFiltered: 1 << 24,
  gyroXFiltered: 1 << 25,

  accelerometerZFiltered: 1 << 13,
  accelerometerYFiltered: 1 << 14,
  accelerometerXFiltered: 1 << 15,
  imuYawAngleFiltered: 1 << 16,
  imuRollAngleFiltered: 1 << 17,
  imuPitchAngleFiltered: 1 << 18,

  gyroFilteredAll: 58720256,
  orientationFilteredAll: 458752,
  accelerometerFilteredAll: 57344,
  locatorFilteredAll: 120,
};

export default class SpheroBolt {
  constructor(webBluetoothId) {
    this.seqNumber = 0;
    this.connected = false;
    this.characs = new Map();
    this.eventListeners = {};
    this.device = null;
    this.queue = new Queue(this.write);
    bolt = this;
    getDeviceById(webBluetoothId).then(device => {
      this.device = device;
      this.connect().then(() => {
        this.on('onWillSleepAsync', () => {
          console.log('Waking up robot');
          this.wake();
        });
        this.on('onCompassNotify', async angle => {
          this.setAllLeds(0, 0, 0);
          // this.setMainLedColor(255, 0, 0);
          await this.setHeading(angle);
        });
      });
      device.addEventListener('gattserverdisconnected', () => {
        console.log('Disconnected');
        this.connected = false;
      });
    });
  }

  /* Connect to Sphero */
  async connect() {
    try {
      const server = await this.device.gatt.connect();
      const services = await server.getPrimaryServices();

      for (const service of services) {
        if (service.uuid === UUID_SPHERO_SERVICE) {
          const characteristics = await service.getCharacteristics();
          for (const charac of characteristics) {
            if (charac.uuid === APIV2_CHARACTERISTIC) {
              await this.mapCharacteristic(charac);
            }
          }
        } else if (service.uuid === UUID_SPHERO_SERVICE_INITIALIZE) {
          const characteristics = await service.getCharacteristics();
          for (const charac of characteristics) {
            if (
              charac.uuid === ANTIDOS_CHARACTERISTIC ||
              charac.uuid === DFU_CONTROL_CHARACTERISTIC ||
              charac.uuid === DFU_INFO_CHARACTERISTIC ||
              charac.uuid === SUBS_CHARACTERISTIC
            ) {
              await this.mapCharacteristic(charac);
            }
          }
        }
      }
      console.log('Connected !');
      await this.init();
    } catch (error) {
      console.log(error.message);
    }
  }

  /* Disconnect from Sphero */
  async disconnect() {
    if (this.connected) {
      await this.device.gatt.disconnect();
      this.connected = false;
      this.device = null;
    } else {
      throw 'Device is not connected';
    }
  }

  /* Init Sphero after connection*/
  async init() {
    await this.characs.get(ANTIDOS_CHARACTERISTIC).writeValue(useTheForce);
    this.connected = true;
    this.wake();
    this.resetYaw();
    this.resetLocator();
    this.setAllLeds(255, 255, 255);
  }

  async mapCharacteristic(charac) {
    if (charac.properties.notify) {
      await charac.startNotifications();
    }
    this.characs.set(charac.uuid, charac);
    charac.addEventListener('characteristicvaluechanged', this.onDataChange);
  }

  /*  Write a command on a specific characteristic*/
  async write(data) {
    if (!bolt.connected) {
      await bolt.connect();
    }
    try {
      await data.charac.writeValue(new Uint8Array(data.command));
    } catch (error) {
      console.log(error.message);
    }
  }

  /* Packet encoder */
  createCommand(commandInfo) {
    const {deviceId, commandId, targetId, data} = commandInfo;
    this.seqNumber = (this.seqNumber + 1) % 255;
    let sum = 0;
    const command = [];
    command.push(APIConstants.startOfPacket);
    const cmdflg =
      Flags.requestsResponse |
      Flags.resetsInactivityTimeout |
      (targetId ? Flags.commandHasTargetId : 0);
    command.push(cmdflg);
    sum += cmdflg;
    if (targetId) {
      command.push(targetId);
      sum += targetId;
    }
    commandPushByte(command, deviceId);
    sum += deviceId;
    commandPushByte(command, commandId);
    sum += commandId;
    commandPushByte(command, this.seqNumber);
    sum += this.seqNumber;
    for (let i = 0; i < data.length; i++) {
      commandPushByte(command, data[i]);
      sum += data[i];
    }
    const chk = ~sum & 0xff;
    commandPushByte(command, chk);
    command.push(APIConstants.endOfPacket);
    return command;
  }

  /* Put a command on the queue */
  queueCommand(command) {
    this.queue.queue({
      charac: this.characs.get(APIV2_CHARACTERISTIC),
      command: command,
    });
  }

  /* Waking up Sphero */
  wake() {
    const commandInfo = {
      deviceId: DeviceId.powerInfo,
      commandId: PowerCommandIds.wake,
      data: [],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Enables collision detection */
  configureCollisionDetection(
    xThreshold = 100,
    yThreshold = 100,
    xSpeed = 100,
    ySpeed = 100,
    deadTime = 10,
    method = 0x01
  ) {
    const commandInfo = {
      deviceId: DeviceId.sensor,
      commandId: SensorCommandIds.configureCollision,
      targetId: 0x12,
      data: [method, xThreshold, xSpeed, yThreshold, ySpeed, deadTime],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Enables sensor data streaming */
  configureSensorStream() {
    const mask = [
      SensorMaskValues.accelerometer,
      SensorMaskValues.orientation,
      SensorMaskValues.locator,
      SensorMaskValues.gyro,
    ];
    const interval = 100;
    this.rawMask = maskToRaw(mask);
    this.sensorMask(flatSensorMask(this.rawMask.aol), interval);
    this.sensorMaskExtended(flatSensorMask(this.rawMask.gyro));
  }

  /* Sends sensors mask to Sphero (acceleremoter, orientation and locator) */
  sensorMask(rawValue, interval) {
    const commandInfo = {
      deviceId: DeviceId.sensor,
      commandId: SensorCommandIds.sensorMask,
      targetId: 0x12,
      data: [
        (interval >> 8) & 0xff,
        interval & 0xff,
        0,
        (rawValue >> 24) & 0xff,
        (rawValue >> 16) & 0xff,
        (rawValue >> 8) & 0xff,
        rawValue & 0xff,
      ],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }
  /* Sends sensors mask to Sphero (gyroscope) */
  sensorMaskExtended(rawValue) {
    const commandInfo = {
      deviceId: DeviceId.sensor,
      commandId: SensorCommandIds.sensorMaskExtented,
      targetId: 0x12,
      data: [
        (rawValue >> 24) & 0xff,
        (rawValue >> 16) & 0xff,
        (rawValue >> 8) & 0xff,
        rawValue & 0xff,
      ],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Sets the color of the back and front LED */
  setLedsColor(r, g, b) {
    const commandInfo = {
      deviceId: DeviceId.userIO,
      commandId: UserIOCommandIds.allLEDs,
      data: [0x00, 0x0e, r, g, b],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  setBackLedIntensity(intensity) {
    const commandInfo = {
      deviceId: DeviceId.userIO,
      commandId: UserIOCommandIds.allLEDs,
      data: [0x00, 0x01, intensity],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Sets the color of the back LED */
  setBackLedColor(r, g, b) {
    const commandInfo = {
      deviceId: DeviceId.userIO,
      commandId: UserIOCommandIds.allLEDs,
      data: [0x38, r, g, b],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Rolls the Sphero */
  roll(speed, heading, flags) {
    const commandInfo = {
      deviceId: DeviceId.driving,
      commandId: DrivingCommandIds.driveWithHeading,
      targetId: 0x12,
      data: [speed, (heading >> 8) & 0xff, heading & 0xff, flags],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
    this.heading = heading;
  }

  /* Prints a char on the LED matrix  */
  printChar(char, r, g, b) {
    const commandInfo = {
      deviceId: DeviceId.userIO,
      commandId: UserIOCommandIds.printChar,
      targetId: 0x12,
      data: [r, g, b, char.charCodeAt()],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Sets the current orientation as orientation 0° */
  resetYaw() {
    const commandInfo = {
      deviceId: DeviceId.driving,
      commandId: DrivingCommandIds.resetYaw,
      targetId: 0x12,
      data: [],
    };
    this.heading = 0;
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Resets the locator */
  resetLocator() {
    const commandInfo = {
      deviceId: DeviceId.sensor,
      commandId: SensorCommandIds.resetLocator,
      targetId: 0x12,
      data: [],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Rolls the Sphero */
  async rollTime(speed, heading, time, flags) {
    setTimeout((heading, flags) => this.roll(0, this.heading, []), time);
    await this.roll(speed, heading, flags);
  }

  /* Sets the color of the LED matrix */
  setMatrixColor(r, g, b) {
    const commandInfo = {
      deviceId: DeviceId.userIO,
      commandId: UserIOCommandIds.matrixColor,
      targetId: 0x12,
      data: [r, g, b],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Finds the north */
  calibrateToNorth() {
    const commandInfo = {
      deviceId: DeviceId.sensor,
      commandId: SensorCommandIds.calibrateToNorth,
      targetId: 0x12,
      data: [],
    };
    const command = this.createCommand(commandInfo);
    this.queueCommand(command);
  }

  /* Set the color of the LEd matrix and front and back LED */
  setAllLeds(r, g, b) {
    this.setLedsColor(r, g, b);
  }

  /* Sets Sphero heading */
  async setHeading(heading) {
    if (heading < 0) {
      heading += 360;
    }
    this.roll(0, heading, []);
    await wait(1000);
    this.resetYaw();
  }

  /* Function triggered by the event characteristicvaluechanged */
  onDataChange(event) {
    this.init = function () {
      this.packet = [];
      this.sum = 0;
      this.escaped = false;
    };

    const len = event.target.value.byteLength;

    for (let i = 0; i < len; i++) {
      let value = event.target.value.getUint8(i);
      switch (value) {
        case APIConstants.startOfPacket:
          if (this.packet === undefined || this.packet.length !== 0) {
            this.init();
          }
          this.packet.push(value);
          break;
        case APIConstants.endOfPacket:
          this.sum -= this.packet[this.packet.length - 1];
          if (this.packet.length < 6) {
            console.log('Packet is too small');
            this.init();

            break;
          }
          if (this.packet[this.packet.length - 1] !== (~this.sum & 0xff)) {
            console.log('Bad checksum');
            this.init();
            break;
          }
          this.packet.push(value);
          bolt.decode(this.packet);
          this.init();
          break;
        case APIConstants.escape:
          this.escaped = true;
          break;
        case APIConstants.escapedEscape:
        case APIConstants.escapedStartOfPacket:
        case APIConstants.escapedEndOfPacket:
          if (this.escaped) {
            value = value | APIConstants.escapeMask;
            this.escaped = false;
          }
          this.packet.push(value);
          this.sum += value;
          break;
        default:
          if (this.escaped) {
            console.log('No escaped char...');
          } else {
            this.packet.push(value);
            this.sum += value;
          }
      }
    }
  }

  /* If the packet is a notification , calls the right handler, else print the command status*/
  readCommand(command) {
    if (command.seqNumber === 255) {
      if (
        command.deviceId === DeviceId.powerInfo &&
        command.commandId === PowerCommandIds.batteryStateChange
      ) {
        switch (command.data[0]) {
          case BatteryState.charging:
            this.handleCharging(command);
            break;
          case BatteryState.notCharging:
            this.handleNotCharging(command);
            break;
          case BatteryState.charged:
            this.handleCharged(command);
            break;
          default:
            console.log('Unknown battery state');
        }
      } else if (
        command.deviceId === DeviceId.powerInfo &&
        command.commandId === PowerCommandIds.willSleepAsync
      ) {
        this.handleWillSleepAsync(command);
      } else if (
        command.deviceId === DeviceId.powerInfo &&
        command.commandId === PowerCommandIds.sleepAsync
      ) {
        this.handleSleepAsync(command);
      } else if (
        command.deviceId === DeviceId.sensor &&
        command.commandId === SensorCommandIds.collisionDetectedAsync
      ) {
        this.handleCollision(command);
      } else if (
        command.deviceId === DeviceId.sensor &&
        command.commandId === SensorCommandIds.sensorResponse
      ) {
        this.handleSensorUpdate(command);
      } else if (
        command.deviceId === DeviceId.sensor &&
        command.commandId === SensorCommandIds.compassNotify
      ) {
        this.handleCompassNotify(command);
      } else {
        console.log('UNKNOWN EVENT ' + command.packet);
      }
    } else {
      this.printCommandStatus(command);
    }
  }

  on(eventName, handler) {
    this.eventListeners[eventName] = handler;
  }

  /*-------------------------------------------------------------------------------
									EVENT HANDLERS
	-------------------------------------------------------------------------------*/
  handleCollision(command) {
    const handler = this.eventListeners['onCollision'];
    if (handler) {
      handler(command);
    } else {
      console.log('Event detected: onCollision, no handler for this event');
    }
  }

  handleCompassNotify(command) {
    const handler = this.eventListeners['onCompassNotify'];
    if (handler) {
      let angle = command.data[0] << 8;
      angle += command.data[1];
      handler(angle);
    } else {
      console.log('Event detected: onCompassNotify, no handler for this event');
    }
  }
  handleWillSleepAsync(command) {
    const handler = this.eventListeners['onWillSleepAsync'];
    if (handler) {
      handler(command);
    } else {
      console.log(
        'Event detected: onWillSleepAsync, no handler for this event'
      );
    }
  }

  handleSleepAsync(command) {
    const handler = this.eventListeners['onSleepAsync'];
    if (handler) {
      handler(command);
    } else {
      console.log('Event detected: onSleepAsync, no handler for this event');
    }
  }

  handleCharging(command) {
    const handler = this.eventListeners['onCharging'];
    if (handler) {
      handler(command);
    } else {
      console.log('Event detected: onCharging, no handler for this event');
    }
  }

  handleNotCharging(command) {
    const handler = this.eventListeners['onNotCharging'];
    if (handler) {
      handler(command);
    } else {
      console.log('Event detected: onNotCharging, no handler for this event');
    }
  }

  handleCharged(command) {
    const handler = this.eventListeners['onCharged'];
    if (handler) {
      handler(command);
    } else {
      console.log('Event detected: onCharged, no handler for this event');
    }
  }

  handleSensorUpdate(command) {
    const handler = this.eventListeners['onSensorUpdate'];
    if (handler) {
      const parsedResponse = parseSensorResponse(command.data, this.rawMask);
      handler(parsedResponse);
    } else {
      console.log('Event detected: onSensorUpdate, no handler for this event');
    }
  }

  //-------------------------------------------------------------------------------

  /* Prints the status of a command */
  printCommandStatus(command) {
    switch (command.data[0]) {
      case ApiErrors.success:
        //console.log('Command succefully executed!');
        break;
      case ApiErrors.badDeviceId:
        console.log('Error: Bad device id');
        break;
      case ApiErrors.badCommandId:
        console.log('Error: Bad command id');
        break;
      case ApiErrors.notYetImplemented:
        console.log('Error: Bad device id');
        break;
      case ApiErrors.commandIsRestricted:
        console.log('Error: Command is restricted');
        break;
      case ApiErrors.badDataLength:
        console.log('Error: Bad data length');
        break;
      case ApiErrors.commandFailed:
        console.log('Error: Command failed');
        break;
      case ApiErrors.badParameterValue:
        console.log('Error: Bad paramater value');
        break;
      case ApiErrors.busy:
        console.log('Error: Busy');
        break;
      case ApiErrors.badTargetId:
        console.log('Error: Bad target id');
        break;
      case ApiErrors.targetUnavailable:
        console.log('Error: Target unavailable');
        break;
      default:
        console.log('Error: Unknown error');
    }
  }

  /* Packet decoder */
  decode(packet) {
    const command = {};
    command.packet = [...packet];
    command.startOfPacket = packet.shift();
    command.flags = decodeFlags(packet.shift());
    if (command.flags.hasTargetId) {
      command.targetId = packet.shift();
    }
    if (command.flags.hasSourceId) {
      command.sourceId = packet.shift();
    }
    command.deviceId = packet.shift();
    command.commandId = packet.shift();
    command.seqNumber = packet.shift();
    command.data = [];
    const dataLen = packet.length - 2;
    for (let i = 0; i < dataLen; i++) {
      command.data.push(packet.shift());
    }
    command.checksum = packet.shift();
    command.endOfPacket = packet.shift();
    this.readCommand(command);
  }
}

function commandPushByte(command, b) {
  switch (b) {
    case APIConstants.startOfPacket:
      command.push(APIConstants.escape, APIConstants.escapedStartOfPacket);
      break;
    case APIConstants.escape:
      command.push(APIConstants.escape, APIConstants.escapedEscape);
      break;
    case APIConstants.endOfPacket:
      command.push(APIConstants.escape, APIConstants.escapedEndOfPacket);
      break;
    default:
      command.push(b);
  }
}

function decodeFlags(flags) {
  const isResponse = flags & Flags.isResponse;
  const requestsResponse = flags & Flags.requestsResponse;
  const requestOnlyErrorResponse = flags & Flags.requestOnlyErrorResponse;
  const resetsInactivityTimeout = flags & Flags.resetsInactivityTimeout;
  const hasTargetId = flags & Flags.commandHasTargetId;
  const hasSourceId = flags & Flags.commandHasSourceId;
  return {
    isResponse,
    requestsResponse,
    requestOnlyErrorResponse,
    resetsInactivityTimeout,
    hasTargetId,
    hasSourceId,
  };
}

const wait = time => {
  return new Promise(callback => setTimeout(callback, time));
};

const maskToRaw = sensorMask => {
  return {
    aol: sensorMask.reduce((aol, m) => {
      let mask;
      switch (m) {
        case SensorMaskValues.accelerometer:
          mask = SensorMask.accelerometerFilteredAll;
          break;
        case SensorMaskValues.locator:
          mask = SensorMask.locatorFilteredAll;
          break;
        case SensorMaskValues.orientation:
          mask = SensorMask.orientationFilteredAll;
          break;
      }
      if (mask) {
        return [...aol, mask];
      }
      return aol;
    }, []),
    gyro: sensorMask.reduce((gyro, m) => {
      let mask;
      if (m === SensorMaskValues.gyro) {
        mask = SensorMask.gyroFilteredAll;
      }
      if (mask) {
        return [...gyro, mask];
      }
      return gyro;
    }, []),
  };
};

const flatSensorMask = sensorMask =>
  sensorMask.reduce((bits, m) => {
    return (bits |= m);
  }, 0);

const parseSensorResponse = (data, mask) => {
  let state = {data, mask, offset: 0, response: {}};
  state = fillAngle(state);
  state = fillAccelerometer(state);
  state = fillLocator(state);
  state = fillGyro(state);
  return state.response;
};

const convertBinaryToFloat = (data, offset) => {
  if (offset + 4 > data.length) {
    console.log('error');
    return 0;
  }
  const uint8Tab = new Uint8Array([
    data[offset],
    data[offset + 1],
    data[offset + 2],
    data[offset + 3],
  ]);
  const view = new DataView(uint8Tab.buffer);
  return view.getFloat32(0);
};

const fillAngle = state => {
  const {data, mask, response} = state;
  let {offset} = state;

  if (mask.aol.indexOf(SensorMask.orientationFilteredAll) >= 0) {
    const pitch = convertBinaryToFloat(data, offset);
    offset += 4;

    const roll = convertBinaryToFloat(data, offset);
    offset += 4;

    const yaw = convertBinaryToFloat(data, offset);
    offset += 4;

    response.angles = {
      pitch,
      roll,
      yaw,
    };
  }
  return {
    data,
    mask,
    offset,
    response,
  };
};

const fillAccelerometer = state => {
  const {data, mask, response} = state;
  let {offset} = state;

  if (mask.aol.indexOf(SensorMask.accelerometerFilteredAll) >= 0) {
    const x = convertBinaryToFloat(data, offset);
    offset += 4;

    const y = convertBinaryToFloat(data, offset);
    offset += 4;

    const z = convertBinaryToFloat(data, offset);
    offset += 4;

    response.accelerometer = {
      x,
      y,
      z,
    };
  }
  return {
    data,
    mask,
    offset,
    response,
  };
};

const fillLocator = state => {
  const {data, mask, response} = state;
  let {offset} = state;

  if (mask.aol.indexOf(SensorMask.locatorFilteredAll) >= 0) {
    const positionX = convertBinaryToFloat(data, offset) * 100.0;
    offset += 4;

    const positionY = convertBinaryToFloat(data, offset) * 100.0;
    offset += 4;

    const velocityX = convertBinaryToFloat(data, offset) * 100.0;
    offset += 4;

    const velocityY = convertBinaryToFloat(data, offset) * 100.0;
    offset += 4;

    response.locator = {
      positionX,
      positionY,
      velocityX,
      velocityY,
    };
  }
  return {
    data,
    mask,
    offset,
    response,
  };
};

const fillGyro = state => {
  const {data, mask, response} = state;
  let {offset} = state;

  if (mask.gyro.indexOf(SensorMask.gyroFilteredAll) >= 0) {
    const x = convertBinaryToFloat(data, offset);
    offset += 4;

    const y = convertBinaryToFloat(data, offset);
    offset += 4;

    const z = convertBinaryToFloat(data, offset);
    offset += 4;

    response.gyro = {
      x,
      y,
      z,
    };
  }
  return {
    data,
    mask,
    offset,
    response,
  };
};
