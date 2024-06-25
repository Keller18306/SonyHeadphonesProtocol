import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { BatteryChargingStatus } from "../enum/BatteryChargingStatus";
import { PowerInquiredType } from "../enum/PowerInquiredType";

type SupportedType = PowerInquiredType.BATTERY_WITH_THRESHOLD | PowerInquiredType.CRADLE_BATTERY_WITH_THRESHOLD;

export class PowerStatusBatteryWithThreshold extends BasicCommand {
    public type: SupportedType;

    public static fromBuffer(type: SupportedType, reader: ReadBuffer): PowerStatusBatteryWithThreshold {
        return new PowerStatusBatteryWithThreshold(
            type,
            reader.readUInt8(),
            reader.readUInt8(),
            reader.readUInt8()
        );
    }

    constructor(
        type: SupportedType,
        public value: number,
        public status: BatteryChargingStatus,
        public threshold: number
    ) {
        super();

        this.type = type;

        assertEnumValue(BatteryChargingStatus, status);
    }

    public getData() {
        return {
            value: this.value,
            status: BatteryChargingStatus[this.status],
            threshold: this.threshold
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.value);
        writer.writeUInt8(this.status);
        writer.writeUInt8(this.threshold);

        return writer.toBuffer();
    }
}