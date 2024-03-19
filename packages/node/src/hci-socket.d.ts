declare module 'hci-socket' {
  export default class HciSocket {
    constructor(devId?: number);

    getDevList(): Promise<{devId: number; devUp: boolean}[]>;

    getDevInfo(devId: number): Promise<{devId: number; devUp: boolean}>;
  }
}
