import EventEmitter from "events";
import { RawMessage } from "./frame";

export class ProtocolStream extends EventEmitter {
    private buffer: Buffer;

    constructor() {
        super();

        this.buffer = Buffer.alloc(0);
        this.on('data', this.receive.bind(this))
    }

    private receive(data: Buffer, ...args: any) {
        // console.log('Received data:', data);
        const bytes: number[] = Array.from(this.buffer);

        for (const byte of data) {
            if (byte === RawMessage.MESSAGE_HEADER) {
                bytes.length = 0;
            }

            bytes.push(byte);

            if (byte === RawMessage.MESSAGE_TRAILER) {
                const message = Buffer.from(bytes);
                this.emit('message', message, ...args)

                bytes.length = 0;
            }
        }

        this.buffer = Buffer.from(bytes);
    }
}