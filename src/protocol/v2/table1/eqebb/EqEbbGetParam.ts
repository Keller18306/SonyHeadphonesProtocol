import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { EqEbbInquiredType } from "./enum/EqEbbInquiredType";

export class EqEbbGetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.EQEBB_GET_PARAM;

    public static fromBuffer(buffer: Buffer): EqEbbGetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.EQEBB_GET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: EqEbbInquiredType = reader.readUInt8();

        return new EqEbbGetParam(inquiredType);
    }

    constructor(public inquiredType: EqEbbInquiredType) {
        super();

        assertEnumValue(EqEbbInquiredType, inquiredType);
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