import { ReadBuffer, WriteBuffer } from "../../utils/buffer";

export class SonyBool {
    public static fromReader(reader: ReadBuffer): boolean {
        return this.fromBuffer(reader.readUInt8());
    }

    public static toWriter(writer: WriteBuffer, value: boolean): void {
        writer.writeUInt8(this.toNumber(value));
    }

    public static fromBuffer(buffer: Buffer | number): boolean {
        if (Buffer.isBuffer(buffer)) {
            buffer = buffer[0];
        }

        if (buffer === 0) {
            return true;
        }

        if (buffer === 1) {
            return false;
        }

        throw new Error('Invalid SonyBool byte');
    }

    public static toNumber(value: boolean): number {
        return Number(!value);
    }

    public static toBuffer(value: boolean): Buffer {
        return Buffer.from([this.toNumber(value)]);
    }
}