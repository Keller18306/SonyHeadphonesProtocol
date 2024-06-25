import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { PeripheralInquiredType } from "../enum/PeripheralInquiredType";

export class PeriParamSourceSwitch extends BasicCommand {
    public type: PeripheralInquiredType = PeripheralInquiredType.SOURCE_SWITCH_CONTROL_CLASSIC_BT;

    public static fromBuffer(reader: ReadBuffer): PeriParamSourceSwitch {
        return new PeriParamSourceSwitch(
            SonyBool.fromReader(reader)
        );
    }

    constructor(public status: boolean) {
        super();
    }

    public getData() {
        return {
            status: this.status
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.status);

        return writer.toBuffer();
    }
}