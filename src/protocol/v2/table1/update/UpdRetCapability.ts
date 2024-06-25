import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { SonyBool } from "../../SonyBool";
import { CommandTable1 } from "../table";
import { UpdtInquiredType } from "./enum/UpdtInquiredType";

export class UpdtRetCapability extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.UPDT_RET_CAPABILITY;

    public static fromBuffer(buffer: Buffer): UpdtRetCapability {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.UPDT_RET_CAPABILITY) {
            throw new Error('Invalid data');
        }

        const inquiredType: UpdtInquiredType = reader.readUInt8();
        const length = reader.readUInt8();

        if (reader.remain !== length) {
            throw new Error('Invalid data length');
        }

        return new UpdtRetCapability(inquiredType,
            SonyBool.fromReader(reader),
            SonyBool.fromReader(reader),
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        public inquiredType: UpdtInquiredType,
        public resumable: boolean,
        public tws: boolean,
        public backgroundTransfer: boolean
    ) {
        super();
    }

    public getData() {
        return {
            inquiredType: UpdtInquiredType[this.inquiredType],
            resumable: this.resumable,
            tws: this.tws,
            backgroundTransfer: this.backgroundTransfer
        };
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        writer.writeUInt8(3);

        SonyBool.toWriter(writer, this.resumable);
        SonyBool.toWriter(writer, this.tws);
        SonyBool.toWriter(writer, this.backgroundTransfer);

        return writer.toBuffer();
    }
}