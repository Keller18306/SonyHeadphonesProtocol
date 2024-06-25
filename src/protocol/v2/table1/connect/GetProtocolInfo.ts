import { ReadBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { ConnectInquired } from "./enum";

export class ConnectGetProtocolInfo extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.CONNECT_GET_PROTOCOL_INFO;

    public static fromBuffer(buffer: Buffer): ConnectGetProtocolInfo {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.CONNECT_GET_PROTOCOL_INFO) {
            throw new Error('Invalid data');
        }

        if (reader.readUInt8() !== ConnectInquired.FIXED_VALUE) {
            throw new Error('Invalid data');
        }

        return new ConnectGetProtocolInfo();
    }

    public getData() {
        return null;
    }

    public toBuffer(): Buffer {
        return Buffer.from([this.command, ConnectInquired.FIXED_VALUE]);
    }
}