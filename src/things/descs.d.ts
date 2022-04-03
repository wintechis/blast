declare module 'joy-con-webhid' {
  import {JoyCon, JoyConLeft, JoyConRight} from './joycon';
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
  declare const connectedJoyCons: Map<number | undefined, JoyCon>;
  declare const connectJoyCon: () => Promise<void>;
  export {connectJoyCon, connectedJoyCons, JoyConLeft, JoyConRight};
}
