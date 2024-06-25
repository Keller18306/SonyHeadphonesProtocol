import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { SonyStringUTF8 } from "../../utils/string";
import { CommandTable1 } from "../table";
import { ConnectInquired } from "./enum";

export class ConnectRetCapabilityInfo extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.CONNECT_RET_CAPABILITY_INFO;

    public static fromBuffer(buffer: Buffer): ConnectRetCapabilityInfo {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.CONNECT_RET_CAPABILITY_INFO) {
            throw new Error('Invalid data');
        }

        if (reader.readUInt8() !== ConnectInquired.FIXED_VALUE) {
            throw new Error('Invalid data');
        }

        return new ConnectRetCapabilityInfo(
            reader.readUInt8(), SonyStringUTF8.read(reader)
        );
    }

    constructor(
        public capabilityCounter: number, public capability: string
    ) {
        super();
    }

    public getData() {
        return {
            capabilityCounter: this.capabilityCounter,
            capability: this.capability
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(ConnectInquired.FIXED_VALUE);
        writer.writeUInt8(this.capabilityCounter);
        SonyStringUTF8.write(writer, this.capability);

        return writer.toBuffer();
    }
}