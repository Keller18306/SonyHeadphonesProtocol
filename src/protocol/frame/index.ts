import { ReadBuffer, WriteBuffer } from "../../utils/buffer";
import { enumToString } from "../../utils/enum";
import { intToHexStr } from "../../utils/hex";
import { Checksum } from "./checksum";
import { FrameDataType } from "./dataType";
import { Escaper } from "./escaper";
import { RawMessage } from "./raw";

export class Frame {
    public static fromRaw(rawMessage: Buffer) {
        let buffer = new ReadBuffer(rawMessage);

        if (buffer.readInt8() !== RawMessage.MESSAGE_HEADER) {
            throw new Error('Invalid header');
        }

        const message = Escaper.unescape(buffer.readPadding(1));

        if (buffer.readInt8() !== RawMessage.MESSAGE_TRAILER) {
            throw new Error('Invalid trailer');
        }

        const calculatedChecksum = Checksum.calc(message.subarray(0, message.length - 1));
        buffer = new ReadBuffer(message);

        const messageType: FrameDataType = buffer.readUInt8();
        const sequenceNumber: number = buffer.readUInt8();
        const payloadLength: number = buffer.readUInt32BE();
        const payload: Buffer = buffer.readBuffer(payloadLength);
        const checkcum: number = buffer.readUInt8();

        if (!buffer.isEnd()) {
            throw new Error('Not all buffer readed');
        }

        if (calculatedChecksum !== checkcum) {
            throw new Error('Invalid checksum');
        }

        return new Frame(messageType, sequenceNumber, payload);
    }

    constructor(
        public readonly dataType: FrameDataType,
        public readonly sequenceNumber: number,
        public readonly payload: Buffer = Buffer.alloc(0)
    ) { }

    public toString() {
        const info: string[] = [
            `msg:${enumToString(FrameDataType, this.dataType, '???')}(${intToHexStr(this.dataType)})`,
            `seq:${this.sequenceNumber}`
        ];

        if (this.payload.length > 0) {
            info.push(...[
                `payload[${this.payload.length}]:${this.payload.toString('hex').toUpperCase().match(/..?/g)?.join(' ')}`
            ]);
        }

        // if (this.payload.length > 0) {
        //     info.push(...[
        //         `payload:${this.payload.length}`
        //     ]);
        // }

        return `Frame{${info.join(', ')}}`
    }

    public toRaw() {
        const buffer = new WriteBuffer();

        buffer.writeUInt8(this.dataType);
        buffer.writeUInt8(this.sequenceNumber);
        buffer.writeUInt32BE(this.payload.length);
        buffer.writeBuffer(this.payload);

        const messsage = buffer.toBuffer();
        buffer.reset();

        buffer.writeUInt8(RawMessage.MESSAGE_HEADER);

        buffer.writeBuffer(Escaper.escape(messsage));
        buffer.writeBuffer(Escaper.escape(Checksum.calc(messsage)));

        buffer.writeUInt8(RawMessage.MESSAGE_TRAILER);

        return buffer.toBuffer();
    }

}

export * from './dataType';
export * from './raw';

