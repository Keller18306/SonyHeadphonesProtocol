import { EventEmitter } from "events";
import { sonyProtocolV2_UUID } from "../protocol";
import { IBluetoothConnector } from "./IBluetoothConnector";

export class BluetoothWebConnector extends EventEmitter implements IBluetoothConnector {
    private writer?: WritableStreamDefaultWriter<Buffer>;

    public static async requestPort() {
        const port = await navigator.serial.requestPort({
            allowedBluetoothServiceClassIds: [sonyProtocolV2_UUID.normal, sonyProtocolV2_UUID.reversed]
        });

        return new this(port);
    }

    constructor(private port: SerialPort) {
        super();
    }

    private async _startReadableThread() {
        const reader = this.port.readable!.getReader();

        try {
            console.log('a')
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    console.log('reader canceled')
                    break;
                }

                this.emit('data', Buffer.from(value));

                const str = new TextDecoder().decode(value);

                console.log('Data', value, str);
            }
        } catch (error) {
            console.error('error', error)
        } finally {
            console.log('release')
            reader.releaseLock();
        }
    }

    public async open() {
        await this.port.open({ baudRate: 9600 });

        const writable = this.port.writable;
        if (!writable || !this.port.readable) {
            await this.close();

            throw new Error('Writable/readable not available');
        }

        this.writer = writable.getWriter();

        this._startReadableThread().catch((e) => {
            console.error('readable thread error', e);
        });
    }

    public async write(buffer: Buffer) {
        this.writer?.write(buffer);
    }

    public async close() {
        return this.port.close();
    }
}