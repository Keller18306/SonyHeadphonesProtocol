import { ReadBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable2 } from "../table";
import { PeripheralInquiredType } from "./enum/PeripheralInquiredType";

export class PeriGetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR_NO2;
    public command: CommandTable2 = CommandTable2.PERI_GET_PARAM;

    public static fromBuffer(buffer: Buffer): PeriGetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable2.PERI_GET_PARAM) {
            throw new Error('Invalid data');
        }

        return new PeriGetParam(reader.readUInt8());
    }

    constructor(public inquiredType: PeripheralInquiredType) {
        super();

        assertEnumValue(PeripheralInquiredType, inquiredType);
    }

    public getData() {
        return {
            inquiredType: PeripheralInquiredType[this.inquiredType]
        }
    }

    public toBuffer(): Buffer {
        return Buffer.from([this.command, this.inquiredType]);
    }
}