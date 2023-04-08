export interface HidAdapter {
  getDevice(id: string): Promise<HIDDevice>;
}
