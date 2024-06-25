import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { NcAsmInquiredType } from "./enum/NcAsmInquiredType";

export class NcAsmGetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.NCASM_GET_PARAM;

    public static fromBuffer(buffer: Buffer): NcAsmGetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.NCASM_GET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: NcAsmInquiredType = reader.readUInt8();

        return new NcAsmGetParam(inquiredType);
    }

    constructor(public inquiredType: NcAsmInquiredType) {
        super();

        assertEnumValue(NcAsmInquiredType, inquiredType);
    }

    public getData() {
        return {
            inquiredType: NcAsmInquiredType[this.inquiredType],
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        return writer.toBuffer();
    }
}