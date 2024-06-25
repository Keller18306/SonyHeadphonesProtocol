import { ReadBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { UpdtInquiredType } from "./enum/UpdtInquiredType";

export class UpdtGetCapability extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.UPDT_GET_CAPABILITY;

    public static fromBuffer(buffer: Buffer): UpdtGetCapability {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.UPDT_GET_CAPABILITY) {
            throw new Error('Invalid data');
        }

        return new UpdtGetCapability(reader.readUInt8());
    }

    constructor(public inquiredType: UpdtInquiredType) {
        super();
    }

    public getData() {
        return {
            inquiredType: UpdtInquiredType[this.inquiredType]
        };
    }

    public toBuffer(): Buffer {
        return Buffer.from([this.command, this.inquiredType]);
    }
}