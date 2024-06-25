import { ReadBuffer, WriteBuffer } from "../../../utils/buffer";

export class SonyStringUTF8 {
    public static read(buffer: ReadBuffer, maxLength: number = 128): string {
        let length = buffer.readUInt8();

        if (!length) {
            return '';
        }

        if (length > maxLength) {
            length = maxLength;
        }

        return buffer.readString(length, 'utf8');
    }

    public static write(buffer: WriteBuffer, value: string, maxLength: number = 128): void {
        const encoded = Buffer.from(value, 'utf8');
        const length = Math.min(encoded.length, maxLength);

        buffer.writeUInt8(length);

        if (length) {
            buffer.writeBuffer(encoded.subarray(0, length));
        }
    }
}