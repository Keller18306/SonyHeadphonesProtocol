import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { PeripheralInquiredType } from "../enum/PeripheralInquiredType";

export class PeriSetParamSourceSwitch extends BasicCommand {
    public type: PeripheralInquiredType = PeripheralInquiredType.SOURCE_SWITCH_CONTROL_CLASSIC_BT;

    public static fromBuffer(reader: ReadBuffer): PeriSetParamSourceSwitch {
        return new PeriSetParamSourceSwitch(
            SonyBool.fromReader(reader)
        );
    }

    constructor(public lockSwitch: boolean) {
        super();
    }

    public getData() {
        return {
            lockSwitch: this.lockSwitch
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.lockSwitch);

        return writer.toBuffer();
    }
}