import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { SonyBool } from "../../SonyBool";
import { CommandTable1 } from "../table";
import { ConnectInquired } from "./enum";

export class ConnectRetProtocolInfo extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.CONNECT_RET_PROTOCOL_INFO;

    public static fromBuffer(buffer: Buffer): ConnectRetProtocolInfo {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.CONNECT_RET_PROTOCOL_INFO) {
            throw new Error('Invalid data');
        }

        if (reader.readUInt8() !== ConnectInquired.FIXED_VALUE) {
            throw new Error('Invalid data');
        }

        return new ConnectRetProtocolInfo(
            reader.readUInt32BE(),
            SonyBool.fromReader(reader),
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        public protocolVersion: number, public supportV1: boolean, public supportV2: boolean
    ) {
        super();
    }

    public getData() {
        return {
            protocolVersion: this.protocolVersion,
            supportV1: this.supportV1,
            supportV2: this.supportV2
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(ConnectInquired.FIXED_VALUE);
        writer.writeUInt32BE(this.protocolVersion);
        SonyBool.toWriter(writer, this.supportV1);
        SonyBool.toWriter(writer, this.supportV2);

        return writer.toBuffer();
    }
}