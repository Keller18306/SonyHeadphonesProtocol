import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { EqEbbInquiredType } from "./enum/EqEbbInquiredType";

export class EqEbbGetExtendedInfo extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.EQEBB_GET_EXTENDED_INFO;

    public static fromBuffer(buffer: Buffer): EqEbbGetExtendedInfo {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.EQEBB_GET_EXTENDED_INFO) {
            throw new Error('Invalid data');
        }

        const inquiredType: EqEbbInquiredType = reader.readUInt8();

        return new EqEbbGetExtendedInfo(inquiredType);
    }

    constructor(public inquiredType: EqEbbInquiredType) {
        super();

        assertEnumValue(EqEbbInquiredType, inquiredType);

        if (![
            EqEbbInquiredType.PRESET_EQ,
            EqEbbInquiredType.PRESET_EQ_NONCUSTOMIZABLE,
            EqEbbInquiredType.PRESET_EQ_AND_ULT_MODE
        ].includes(inquiredType)) {
            throw new Error('Unsupported inquiredType')
        }
    }

    public getData() {
        return {
            inquiredType: EqEbbInquiredType[this.inquiredType],
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        return writer.toBuffer();
    }
}