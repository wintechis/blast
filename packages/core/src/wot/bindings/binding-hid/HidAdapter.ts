export interface HidAdapter {
  getDevice(id: string): Promise<HIDDevice>;
  // TODO implement NodeHidAdapter.ts and WebHidAdapter.ts
  // and resolve in webpack config
  // see https://github.com/node-hid/node-hid/issues/223#issuecomment-325003772
}
