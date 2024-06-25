import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { PowerInquiredType } from "./enum";

export class PowerGetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.POWER_GET_STATUS;

    public static fromBuffer(buffer: Buffer): PowerGetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.POWER_GET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType: PowerInquiredType = reader.readUInt8();

        return new PowerGetStatus(inquiredType);
    }

    constructor(public inquiredType: PowerInquiredType) {
        super();

        assertEnumValue(PowerInquiredType, inquiredType);
    }

    public getData() {
        return {
            inquiredType: PowerInquiredType[this.inquiredType],
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        return writer.toBuffer();
    }
}