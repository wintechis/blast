declare module 'ble-host' {

  declare interface scanParameters {
    /**
     * Whether the scan response data should be requested
     * @default true
     */
    activeScan?: boolean;
    /**
     * Integer multiple of 0.625 ms for the suggested scan window
     * @default 16
     */
    scanWindow?: number;
    /**
     * Integer multiple of 0.625 ms for the suggested scan interval
     * @default 16
     */
    scanInterval?: number;
    /**
     * Whether dupicates should be removed
     * @default false
     */
    filterDuplicates?: boolean;
    /**
     * Array of scan filters
     * @default []
     */
  }

  declare interface ConnectParameters {
    /**
     * Integer in the range 6-3200 in units of 1.
     * @default 20
     */
    connIntervalMin?: number;
    /**
     * Integer in the range 6-3200 in units of 1.
     * @default 25
     */
    connIntervalMax?: number;
    /**
     * Integer in the range 0-499 defining Slave Latency.
     * @default 0
     */
    connLatency?: number;
    /**
     * Integer in the range 10-3200 in units of 10 ms.
     * @default 500
     */
    supervisionTimeout?: number;
    /**
     * Integer in the range 0-65535 in units of 0.625 ms.
     * @default 0
     */
    minimumCELength?: number;
    /**
     * Integer in the range 0-65535 in units of 0.625 ms.
     * @default 0
     */
    maximumCELength?: number;
  }

  declare interface updateConnParamsCallback {
    /**
     * @param status An HCI error code indicating the status
     */
    (status: number);
  }

  declare interface readRssiCallback {
    /**
     * @param status An HCI error code indicating the status
     * @param rssi Arriving signal strength at the antenna measured in dBm, where -127 means rssi is not available
     */
    (status: number, rssi: number | undefined);
  }

  declare class PendingConnection {
    /**
     * This method is called to cancel a pending connection.
     * @param callback Callback if the cancel succeeds.
     */
    cancel(callback: Function);
  }

  declare class Connection {
    /**
     * Contains the address type of the local address for this connection (`public` or `random`).
     */
    ownAddressType: string;

    /**
     * Contains the local address for this connection.
     */
    ownAddress: string;

    /**
     * Contains the address type of the peer address for this connection (`public` or `random`).
     */
    peerAddressType: string;

    /**
     * Contains the peer address for this connection.
     */
    peerAddress: string;

    /**
     * Contains the address type of the identity address of the peer device.
     */
    peerIdentityAddressType: string | null;

    /**
     * Contains the identity address of the peer device.
     */
    peerIdentityAddress: string | null;

    /**
     * When the BLE link has finally disconnected, this property is set to `true`.
     * The `disconnect` event is then emitted.
     */
    disconnected: boolean;

    smp: SmpMasterConnection | SmpSlaceConnection;

    gatt: GattConnection;

    l2capCoCManager: L2CAPCoCManager;

    /**
     * @param callback A callback to invoke
     * @param miliseconds After how long time the callback will be invoked
     * @returns A function that when called cancels the timeout.
     */
    setTimeout(callback: Function, milliseconds: number): Function;

    /**
     * This method will initiate the disconnection procedure.
     * @param reason An error code indicating reason for disconnecting
     * @param startIgnoreIncomingData If no more incoming data should be processed
     */
    disconnect(reason?: number, startIgnoreIncomingData?: boolean);

    /**
     * If the `disconnected` property is false, then an attempt to read the RSSI value is performed.
     * @param callback A callback to invoke
     */
    readRssi(callback: readRssiCallback);

    /**
     * update the connection parameters
     */
    updateConnParams(
      parameters: ConnectParameters,
      callback: updateConnParamsCallback
    );
  }

  /**
   * This class is used to perform GATT client operations.
   * Each BLE connection object has an instance of a GattConnection, which can be retrieved through its `gatt` property.
   */
  declare class GattConnection {
    /**
     * Performs an MTU exchange request.
     */
    exchangeMtu(callback: Function);

    /**
     * Performs the Discover All Primary Service procedure,
     * which internally issues multiple requests to discover all primary services.
     */
    discoverAllPrimaryServices(callback: DiscoverPrimaryServicesCallback);

    /**
     * Performs the Discover Primary Service By Service UUID procedure,
     * which internally issues multiple requests to discover primary services of the given UUID.
     * @param uuid UUID of the service to find
     * @param numToFind If this is present, the search may stop earlier
     * if at least this number of service instances have already been found
     * @param callback A callback to invoke
     */
    discoverServicesByUuid(
      uuid: string | number,
      numToFind?: number,
      callback?: DiscoverPrimaryServicesCallback
    );

    /**
     * Invalidates services from the service cache.
     * @param startHandle Positive 16-bit unsigned integer where the invalidated range starts
     * @param endHandle Positive 16-bit unsigned integer where the invalidated range ends
     * (must not be less than the start handle)
     * @param callback Callback taking no arguments
     */
    invalidateServices(
      startHandle: number,
      endHandle: number,
      callback?: Function
    );

    /**
     * Performs a Read Using Characteristic UUID request to read characteristics of a given UUID
     * in a specific handle range. Multiple values may be received in the same response if they
     * have the same length and fits into one packet. Values are truncated to min(253, ATT_MTU - 4)
     * bytes.
     * @param startHandle Positive 16-bit unsigned integer where the search should start
     * @param endHandle Positive 16-bit unsigned integer where the search should end
     * (must not be less than the start handle)
     * @param uuid Characteristic UUID
     * @param callback Callback function to invoke
     */
    readUsingCharacteristicUuid(
      startHandle: number,
      endHandle: number,
      uuid: string | number,
      callback: ReadCharacteristicRangeCallback
    );

    /**
     * Tells the stack that a Reliable Write transaction is started.
     * All characteristic writes except "Write Without Response" to characteristics following this method
     * call will become one Reliable Write transaction, which means they will be queued up at the GATT server
     * and executed atomically when the commitReliableWrite method is called. Long Writes to descriptors are
     * not allowed while Reliable Write is active.
     */
    beginReliableWrite();

    /**
     * Performs a request to cancel Reliable Writes, which means all pending writes (if any) at the
     * server are discarded.
     */
    cancelReliableWrite();

    /**
     * Performs a request to execute all pending writes at the server.
     * From now on, all writes are "normal" again until beginReliableWrite is called again.
     */
    commitReliableWrite();

    /**
     * The current MTU.
     */
    currentMtu: number;
  }

  declare interface DiscoverPrimaryServicesCallback {
    /**
     * @param services Array of services found
     */
    (services: GattClientService[]);
  }

  declare interface ReadCharacteristicRangeCallback {
    /**
     * @param err An `AttErrors` code
     * @param list Non-empty array of results if no error
     */
    (
      err: number,
      list: Array<{
        /**
         * Characteristic handle
         */
        attributeHandle: number;
        /**
         * Characteristic value
         */
        attributeValue: Buffer;
      }>
    );
  }

  /**
   * This class represents a characteristic present on a remote GATT server.
   * Instances of this class can be obtained by the method discoverCharacteristics of a service.
   */
  declare class GattClientCharacteristic extends EventTarget {
    /**
     * The declared properties for this characteristic. The property is an object containing the
     * following keys. The corresponding value for each key is a boolean whether the property is declared or not.
     */
    properties: CharacteristicProperties;

    /**
     * The declaration handle of this characteristic
     */
    declarationHandle: number;

    /**
     * The value handle of this characteristic
     */
    valueHandle: number;

    /**
     * The UUID of this characteristic
     */
    uuid: string;

    /**
     * Performs the Discover All Characteristic Descriptors procedure, which internally issues multiple requests
     * to discover all descriptors of this characteristic. Just like when discovering all primary services,
     * the result may be cached.
     */
    discoverDescriptors(callback: DiscoverDescriptorsCallback);

    /**
     * This performs the Read Long Characteristics Value procedure, which internally first issues a Read Request.
     * If the value returned is as large as fits within one packet, the remainder is read using multiple Read Blob
     * Requests. When completed, the complete value is forwarded to the callback.
     */
    read(callback: ReadCharacteristicCallback);

    /**
     * Same as the `read` method but only performs one Read Request, which means the value passed to the callback
     * might be truncated.
     */
    readShort(callback: ReadCharacteristicCallback);

    /**
     * Same as the read method but starts reading at a specific offset (integer between 0 and 512). The value passed
     * to the callback will contain the characteristic value where the first offset bytes have been omitted.
     */
    readLong(offset: number, callback: ReadCharacteristicCallback);

    /**
     * If Reliable Write is not active, performs either the Write Characteristic Value or the Write Long Characteristic
     * Value procedure, depending on the value length and current MTU.
     *
     * If Reliable Write is active, Prepare Write Requests will be sent. The returned value will be compared to the sent
     * value, per specification, and if the values don't match, the callback will be called with the error
     * AttErrors.RELIABLE_WRITE_RESPONSE_NOT_MATCHING. If that happens, the Reliable Write state is also exited and all
     * pending writes at the server are discarded.
     */
    write(
      value: Buffer | string,
      callback: WriteCharateristicCallback | undefined
    );

    /**
     * Same as `write` but starts writing to a particular offset (integer between 0 and 512).
     */
    writeLong(
      value: Buffer | string,
      offset: number,
      callback: WriteCharateristicCallback | undefined
    );

    /**
     * Performs the Write Without Response procedure, which is not a request.
     * Therefore the packet goes straight to the BLE connection's output buffer, bypassing the request queue. In case
     * you want to write a large amount of packets, you should wait for the `sentCallback` before you write another
     * packet, to make it possible for the stack to interleave other kinds of packets. This does not decrease the
     * throughput, as opposed to waiting for the `completeCallback` between packets.
     *
     * The value will be truncated to `currentMtu - 3` bytes.
     */
    writeWithoutResponse(
      value: Buffer | string,
      sentCallback: Function | undefined,
      completeCallback: Function | undefined
    );

    /**
     * Utility function for first finding a Client Characteristic Configuration Descriptor, then writing the desired
     * value to it.
     * If no descriptor is found, the callback will be called with AttErrors.ATTRIBUTE_NOT_FOUND as error code.
     * Otherwise, the code passed to the callback will be the result of the write.
     * @param enableNotifications Whether notifications should be enabled or disabled
     * @param enableIndications Whether indications should be enabled or disabled
     * @param callback Callback function to invoke
     */
    writeCCCD(
      enableNotifications: boolean,
      enableIndications: boolean,
      callback: WriteCharateristicCallback
    );

    on(event: 'change', listener: ChangeEventListener);
  }

  declare interface ChangeEventListener {
    /**
     * @param value The new value
     * @param isIndication Whether the change was an indication
     * @param callback A callback to invoke
     */
    (value: Buffer, isIndication: boolean, callback: Function);
  }

  declare interface WriteCharateristicCallback {
    /**
     * @param err An `AttErrors` code
     */
    (err: number);
  }

  declare interface ReadCharacteristicCallback {
    /**
     * @param err An `AttErrors` code
     * @param value The read value if no error
     */
    (err: number, value: Buffer | undefined);
  }

  declare interface DiscoverDescriptorsCallback {
    /**
     * @param descriptorsarray of all descriptors found
     */
    (descriptors: GattClientDescriptor[]);
  }

  declare class GattClientDescriptor {
    /**
     * The handle of this descriptor
     */
    handle: number;

    /**
     * The UUID of this descriptor
     */
    uuid: string;

    /**
     * Performs a Read Descriptor request to read the value of this descriptor.
     * @param callback Callback function to invoke
     */
    read(callback: ReadDescriptorCallback);

    // TODO
  }

  declare interface CharacteristicProperties {
    broadcast: boolean;
    read: boolean;
    writeWithoutResponse: boolean;
    write: boolean;
    notify: boolean;
    indicate: boolean;
    authenticatedSignedWrites: boolean;
    extendedProperties: boolean;
  }

  /**
   * This class represents a service present on a remote GATT server.
   * Instances of this class can only be obtained using discovery procedures.
   */
  declare class GattClientService {
    /**
     * The start handle of the service.
     */
    startHandle: number;

    /**
     * The end handle of the service.
     */
    endHandle: number;

    /**
     * The UUID of the service.
     */
    uuid: string;

    /**
     * Performs the Find Included Services procedure, which internally issues multiple requests to find all
     * included services for this service. Just like when discovering all primary services, the result may be cached.
     * @param callback Callback function to invoke
     */
    findIncludedServices(callback: FindIncludedServicesCallback);

    /**
     * Performs the Discover All Characteristics of a Service procedure, which internally issues multiple requests to
     * discover all characteristics of this service. Just like when discovering all primary services, the result may
     * be cached.
     * @param callback Callback function to invoke
     */
    discoverCharacteristics(callback: DiscoverCharacteristicsCallback);
  }

  declare interface DiscoverCharacteristicsCallback {
    /**
     * @param characteristics Array of characteristics found
     */
    (characteristics: GattClientCharacteristic[]);
  }

  declare interface FindIncludedServicesCallback {
    /**
     * @param services Array of services found
     */
    services: GattClientService[];
  }

  declare interface ConnectCallback {
    /**
     * @param connection The object used to interact with the remote device (GATT, SMP, L2CAPCoC etc.)
     */
    (connection: Connection);
  }

  export interface AttErrors {
    // Define properties and methods of AttErrors here
  }

  export interface HciErrors {
    // Define properties and methods of HciErrors here
  }

  export class BleManager {
    /**
     * Starts a scan.
     * @param parameters Scan parameters
     */
    startScan(parameters: scanParameters): Scanner;

    /**
     * Connects to the given device with the supplied parameters.
     * @param bdAddrType The address type of the remote device (`public` or `random`)
     * @param bdAddr Bluetooth Device Address of the device to connect to
     * @param parameters Optional connection parameters
     * @param callback Callback called when the device connects
     * @returns Object that can be used to cancel the connection attempt
     */
    connect(
      bdAddrType: string,
      bdAddr: string,
      parameters: ConnectParameters,
      callback: ConnectCallback
    ): PendingConnection;
  }
}
