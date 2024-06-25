import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { AutoPowerOff, PowerInquiredType } from "../enum";

export class PowerParamAutoPowerOff extends BasicCommand {
    public type: PowerInquiredType = PowerInquiredType.AUTO_POWER_OFF;

    public static fromBuffer(reader: ReadBuffer): PowerParamAutoPowerOff {
        return new PowerParamAutoPowerOff(
            reader.readUInt8(),
            reader.readUInt8()
        );
    }

    constructor(
        public value1: AutoPowerOff,
        public value2: AutoPowerOff
    ) {
        super();

        assertEnumValue(AutoPowerOff, value1);
        assertEnumValue(AutoPowerOff, value2);
    }

    public getData() {
        return {
            value1: AutoPowerOff[this.value1],
            value2: AutoPowerOff[this.value2]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.value1);
        writer.writeUInt8(this.value2);

        return writer.toBuffer();
    }
}