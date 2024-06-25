import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { BatteryChargingStatus } from "../enum/BatteryChargingStatus";
import { PowerInquiredType } from "../enum/PowerInquiredType";

type SupportedType = PowerInquiredType.BATTERY | PowerInquiredType.CRADLE_BATTERY;

export class PowerStatusBattery extends BasicCommand {
    public type: SupportedType;

    public static fromBuffer(type: SupportedType, reader: ReadBuffer): PowerStatusBattery {
        return new PowerStatusBattery(
            type,
            reader.readUInt8(),
            reader.readUInt8()
        );
    }

    constructor(
        type: SupportedType,
        public value: number,
        public status: BatteryChargingStatus
    ) {
        super();

        this.type = type;

        assertEnumValue(BatteryChargingStatus, status);
    }

    public getData() {
        return {
            value: this.value,
            status: BatteryChargingStatus[this.status]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.value);
        writer.writeUInt8(this.status);

        return writer.toBuffer();
    }
}