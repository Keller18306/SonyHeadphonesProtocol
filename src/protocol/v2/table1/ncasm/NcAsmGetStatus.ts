import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { NcAsmInquiredType } from "./enum/NcAsmInquiredType";

export class NcAsmGetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.NCASM_GET_STATUS;

    public static fromBuffer(buffer: Buffer): NcAsmGetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.NCASM_GET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType: NcAsmInquiredType = reader.readUInt8();

        return new NcAsmGetStatus(inquiredType);
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