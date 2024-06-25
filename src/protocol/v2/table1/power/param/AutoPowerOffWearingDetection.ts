import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { AutoPowerOffWearingDetection, PowerInquiredType } from "../enum";

export class PowerParamAutoPowerOffWearingDetection extends BasicCommand {
    public type: PowerInquiredType = PowerInquiredType.AUTO_POWER_OFF_WEARING_DETECTION;

    public static fromBuffer(reader: ReadBuffer): PowerParamAutoPowerOffWearingDetection {
        return new PowerParamAutoPowerOffWearingDetection(
            reader.readUInt8(),
            reader.readUInt8()
        );
    }

    constructor(
        public value1: AutoPowerOffWearingDetection,
        public value2: AutoPowerOffWearingDetection
    ) {
        super();

        assertEnumValue(AutoPowerOffWearingDetection, value1);
        assertEnumValue(AutoPowerOffWearingDetection, value2);
    }

    public getData() {
        return {
            value1: AutoPowerOffWearingDetection[this.value1],
            value2: AutoPowerOffWearingDetection[this.value2]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.value1);
        writer.writeUInt8(this.value2);

        return writer.toBuffer();
    }
}