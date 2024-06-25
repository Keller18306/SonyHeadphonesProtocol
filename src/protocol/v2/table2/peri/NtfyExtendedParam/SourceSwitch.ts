import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { PeripheralInquiredType } from "../enum/PeripheralInquiredType";
import { SourceSwitchControlResult } from "../enum/SourceSwitchControlResult";

export class PeriNtfyExtendedParamSourceSwitch extends BasicCommand {
    public type: PeripheralInquiredType = PeripheralInquiredType.SOURCE_SWITCH_CONTROL_CLASSIC_BT;

    public static fromBuffer(reader: ReadBuffer): PeriNtfyExtendedParamSourceSwitch {
        return new PeriNtfyExtendedParamSourceSwitch(
            reader.readUInt8(),
            reader.readString(17, 'utf8')
        );
    }

    constructor(public result: SourceSwitchControlResult, public address: string) {
        super();

        assertEnumValue(SourceSwitchControlResult, result);
    }

    public getData() {
        return {
            result: SourceSwitchControlResult[this.result],
            address: this.address
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.result);
        writer.writeString(this.address, 'utf8');

        return writer.toBuffer();
    }
}