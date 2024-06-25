import { RawMessage } from ".";

export class Escaper {
    public static escape(buffer: Buffer | number): Buffer {
        if (typeof buffer === 'number') {
            buffer = Buffer.from([buffer]);
        }

        const bytes: number[] = [];

        for (const b of buffer) {
            switch (b) {
                case RawMessage.MESSAGE_HEADER:
                case RawMessage.MESSAGE_TRAILER:
                case RawMessage.MESSAGE_ESCAPE:
                    bytes.push(RawMessage.MESSAGE_ESCAPE);
                    bytes.push(b & RawMessage.MESSAGE_ESCAPE_MASK);
                    break;
                default:
                    bytes.push(b);
                    break;
            }
        }

        return Buffer.from(bytes);
    }

    public static unescape(buffer: Buffer): Buffer {
        const bytes: number[] = [];

        for (let i: number = 0; i < buffer.length; i++) {
            const b: number = buffer[i];

            if (b === RawMessage.MESSAGE_ESCAPE) {
                if (++i >= buffer.length) {
                    throw new Error('Invalid bytes');
                }

                bytes.push(buffer[i] | ~RawMessage.MESSAGE_ESCAPE_MASK);
            } else {
                bytes.push(b);
            }
        }

        return Buffer.from(bytes);
    }
}