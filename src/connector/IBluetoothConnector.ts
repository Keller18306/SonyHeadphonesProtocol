import EventEmitter from "events";

export interface IBluetoothConnector extends EventEmitter {
    write(buffer: Buffer): Promise<void>;
    close(): Promise<void>;
}