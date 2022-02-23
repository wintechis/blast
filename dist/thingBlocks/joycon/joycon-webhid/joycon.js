import * as PacketParser from "./parse.js";
const concatTypedArrays = (a, b) => { const c = new a.constructor(a.length + b.length); c.set(a, 0); c.set(b, a.length); return c; };
class JoyCon extends EventTarget {
    constructor(device) { super(); this.device = device; }
    async open() { if (!this.device.opened) {
        await this.device.open();
    } this.device.addEventListener("inputreport", this._onInputReport.bind(this)); }
    async getRequestDeviceInfo() { const outputReportID = 1; const subcommand = [2]; const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...subcommand]; await this.device.sendReport(outputReportID, new Uint8Array(data)); return new Promise((resolve => { const onDeviceInfo = ({ detail: deviceInfo }) => { this.removeEventListener("deviceinfo", onDeviceInfo); delete deviceInfo._raw; delete deviceInfo._hex; resolve(deviceInfo); }; this.addEventListener("deviceinfo", onDeviceInfo); })); }
    async getBatteryLevel() { const outputReportID = 1; const subCommand = [80]; const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...subCommand]; await this.device.sendReport(outputReportID, new Uint8Array(data)); return new Promise((resolve => { const onBatteryLevel = ({ detail: batteryLevel }) => { this.removeEventListener("batterylevel", onBatteryLevel); delete batteryLevel._raw; delete batteryLevel._hex; resolve(batteryLevel); }; this.addEventListener("batterylevel", onBatteryLevel); })); }
    async enableSimpleHIDMode() { const outputReportID = 1; const subcommand = [3, 63]; const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...subcommand]; await this.device.sendReport(outputReportID, new Uint8Array(data)); }
    async enableStandardFullMode() { const outputReportID = 1; const subcommand = [3, 48]; const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...subcommand]; await this.device.sendReport(outputReportID, new Uint8Array(data)); }
    async enableIMUMode() { const outputReportID = 1; const subcommand = [64, 1]; const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...subcommand]; await this.device.sendReport(outputReportID, new Uint8Array(data)); }
    async disableIMUMode() { const outputReportID = 1; const subcommand = [64, 0]; const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, ...subcommand]; await this.device.sendReport(outputReportID, new Uint8Array(data)); }
    async enableVibration() { const outputReportID = 1; const subcommand = [72, 1]; const data = [0, 0, 1, 64, 64, 0, 1, 64, 64, ...subcommand]; await this.device.sendReport(outputReportID, new Uint8Array(data)); }
    async disableVibration() { const outputReportID = 1; const subcommand = [72, 0]; const data = [0, 0, 1, 64, 64, 0, 1, 64, 64, ...subcommand]; await this.device.sendReport(outputReportID, new Uint8Array(data)); }
    async rumble(lowFrequency, highFrequency, amplitude) { const clamp = (value, min, max) => Math.min(Math.max(value, min), max); const outputReportID = 16; const data = new Uint8Array(9); data[0] = 0; let lf = clamp(lowFrequency, 40.875885, 626.286133); let hf = clamp(highFrequency, 81.75177, 1252.572266); hf = (Math.round(32 * Math.log2(hf * .1)) - 96) * 4; lf = Math.round(32 * Math.log2(lf * .1)) - 64; const amp = clamp(amplitude, 0, 1); let hfAmp; if (amp == 0) {
        hfAmp = 0;
    }
    else if (amp < .117) {
        hfAmp = (Math.log2(amp * 1e3) * 32 - 96) / (5 - Math.pow(amp, 2)) - 1;
    }
    else if (amp < .23) {
        hfAmp = Math.log2(amp * 1e3) * 32 - 96 - 92;
    }
    else {
        hfAmp = (Math.log2(amp * 1e3) * 32 - 96) * 2 - 246;
    } let lfAmp = Math.round(hfAmp) * .5; const parity = lfAmp % 2; if (parity > 0) {
        --lfAmp;
    } lfAmp = lfAmp >> 1; lfAmp += 64; if (parity > 0) {
        lfAmp |= 32768;
    } data[1] = hf & 255; data[2] = hfAmp + (hf >>> 8 & 255); data[3] = lf + (lfAmp >>> 8 & 255); data[4] += lfAmp & 255; for (let i = 0; i < 4; i++) {
        data[5 + i] = data[1 + i];
    } await this.device.sendReport(outputReportID, new Uint8Array(data)); }
    _onInputReport(event) { var _a, _b; let { data, reportId, device } = event; if (!data) {
        return;
    } data = concatTypedArrays(new Uint8Array([reportId]), new Uint8Array(data.buffer)); const hexData = data.map((byte => byte.toString(16))); let packet = { inputReportID: PacketParser.parseInputReportID(data, hexData) }; switch (reportId) {
        case 63: {
            packet = { ...packet, buttonStatus: PacketParser.parseButtonStatus(data, hexData), analogStick: PacketParser.parseAnalogStick(data, hexData), filter: PacketParser.parseFilter(data, hexData) };
            break;
        }
        case 33:
        case 48: {
            packet = { ...packet, timer: PacketParser.parseTimer(data, hexData), batteryLevel: PacketParser.parseBatteryLevel(data, hexData), connectionInfo: PacketParser.parseConnectionInfo(data, hexData), buttonStatus: PacketParser.parseCompleteButtonStatus(data, hexData), analogStickLeft: PacketParser.parseAnalogStickLeft(data, hexData), analogStickRight: PacketParser.parseAnalogStickRight(data, hexData), vibrator: PacketParser.parseVibrator(data, hexData) };
            if (reportId === 33) {
                packet = { ...packet, ack: PacketParser.parseAck(data, hexData), subcommandID: PacketParser.parseSubcommandID(data, hexData), subcommandReplyData: PacketParser.parseSubcommandReplyData(data, hexData), deviceInfo: PacketParser.parseDeviceInfo(data, hexData) };
            }
            if (reportId === 48) {
                const accelerometers = PacketParser.parseAccelerometers(data, hexData);
                const gyroscopes = PacketParser.parseGyroscopes(data, hexData);
                const rps = PacketParser.calculateActualGyroscope(gyroscopes.map((g => g.map((v => v.rps)))));
                const dps = PacketParser.calculateActualGyroscope(gyroscopes.map((g => g.map((v => v.dps)))));
                const acc = PacketParser.calculateActualAccelerometer(accelerometers.map((a => [a.x.acc, a.y.acc, a.z.acc])));
                const quaternion = PacketParser.toQuaternion(rps, acc, device.productId);
                packet = { ...packet, accelerometers, gyroscopes, actualAccelerometer: acc, actualGyroscope: { dps, rps }, actualOrientation: PacketParser.toEulerAngles(rps, acc, device.productId), actualOrientationQuaternion: PacketParser.toEulerAnglesQuaternion(quaternion), quaternion };
            }
            break;
        }
    } if ((_a = packet.deviceInfo) === null || _a === void 0 ? void 0 : _a.type) {
        this._receiveDeviceInfo(packet.deviceInfo);
    } if ((_b = packet.batteryLevel) === null || _b === void 0 ? void 0 : _b.level) {
        this._receiveBatteryLevel(packet.batteryLevel);
    } this._receiveInputEvent(packet); }
    _receiveDeviceInfo(deviceInfo) { this.dispatchEvent(new CustomEvent("deviceinfo", { detail: deviceInfo })); }
    _receiveBatteryLevel(batteryLevel) { this.dispatchEvent(new CustomEvent("batterylevel", { detail: batteryLevel })); }
}
class JoyConLeft extends JoyCon {
    constructor(device) { super(device); }
    _receiveInputEvent(packet) { delete packet.buttonStatus.x; delete packet.buttonStatus.y; delete packet.buttonStatus.b; delete packet.buttonStatus.a; delete packet.buttonStatus.plus; delete packet.buttonStatus.r; delete packet.buttonStatus.zr; delete packet.buttonStatus.home; delete packet.buttonStatus.rightStick; this.dispatchEvent(new CustomEvent("hidinput", { detail: packet })); }
}
class JoyConRight extends JoyCon {
    constructor(device) { super(device); }
    _receiveInputEvent(packet) { delete packet.buttonStatus.up; delete packet.buttonStatus.down; delete packet.buttonStatus.left; delete packet.buttonStatus.right; delete packet.buttonStatus.minus; delete packet.buttonStatus.l; delete packet.buttonStatus.zl; delete packet.buttonStatus.capture; delete packet.buttonStatus.leftStick; this.dispatchEvent(new CustomEvent("hidinput", { detail: packet })); }
}
export { JoyConLeft, JoyConRight };
//# sourceMappingURL=joycon.js.map