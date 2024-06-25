import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { PeripheralInquiredType } from "../enum/PeripheralInquiredType";
import { SourceSwitchControlResult } from "../enum/SourceSwitchControlResult";

export class PeriNtfyParamSourceSwitch extends BasicCommand {
    public type: PeripheralInquiredType = PeripheralInquiredType.SOURCE_SWITCH_CONTROL_CLASSIC_BT;

    public static fromBuffer(reader: ReadBuffer): PeriNtfyParamSourceSwitch {
        return new PeriNtfyParamSourceSwitch(
            SonyBool.fromReader(reader),
            reader.readUInt8()
        );
    }

    constructor(public status: boolean, public result: SourceSwitchControlResult) {
        super();

        assertEnumValue(SourceSwitchControlResult, result);
    }

    public getData() {
        return {
            status: this.status,
            result: SourceSwitchControlResult[this.result]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.status);
        writer.writeUInt8(this.result);

        return writer.toBuffer();
    }
}