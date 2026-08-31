export declare abstract class HidAdapter {
    abstract getDevice(id: string): Promise<HIDDevice>;
}
