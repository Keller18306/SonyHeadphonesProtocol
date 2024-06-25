import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { SonyBool } from "../../SonyBool";
import { CommandTable1 } from "../table";
import { EqEbbInquiredType } from "./enum/EqEbbInquiredType";

export class EqEbbRetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.EQEBB_RET_STATUS;

    public static fromBuffer(buffer: Buffer): EqEbbRetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.EQEBB_RET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType: EqEbbInquiredType = reader.readUInt8();
        const enabled: boolean = SonyBool.fromReader(reader);

        return new EqEbbRetStatus(inquiredType, enabled);
    }

    constructor(
        public inquiredType: EqEbbInquiredType,
        public enabled: boolean
    ) {
        super();

        assertEnumValue(EqEbbInquiredType, inquiredType);
    }

    public getData() {
        return {
            inquiredType: EqEbbInquiredType[this.inquiredType],
            enabled: this.enabled
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);
        SonyBool.toWriter(writer, this.enabled);

        return writer.toBuffer();
    }
}