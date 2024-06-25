import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { NcAsmInquiredType } from "../enum/NcAsmInquiredType";
import { ValueChangeStatus } from "../enum/ValueChangeStatus";

export class NcAsmSetParamNcOnOff extends BasicCommand {
    public type: NcAsmInquiredType = NcAsmInquiredType.NC_ON_OFF;

    public static fromBuffer(reader: ReadBuffer): NcAsmSetParamNcOnOff {
        const changeStatus: ValueChangeStatus = reader.readUInt8();

        const value1 = reader.readBool();
        const value2 = reader.readBool();

        if (value1 !== value2) {
            throw new Error('Invalid data')
        }

        return new NcAsmSetParamNcOnOff(value1, changeStatus);
    }

    constructor(
        public noiseCancel: boolean,
        public changeStatus: ValueChangeStatus = ValueChangeStatus.CHANGED
    ) {
        super();

        assertEnumValue(ValueChangeStatus, changeStatus);
    }

    public getData() {
        return {
            changeStatus: ValueChangeStatus[this.changeStatus],
            noiseCancel: this.noiseCancel
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.changeStatus);
        writer.writeBool(this.noiseCancel);
        writer.writeBool(this.noiseCancel);

        return writer.toBuffer();
    }
}