import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { BatteryChargingStatus } from "../enum/BatteryChargingStatus";
import { PowerInquiredType } from "../enum/PowerInquiredType";

export interface EarphoneStatus {
    value: number,
    status: BatteryChargingStatus
}

export class PowerStatusLeftRight extends BasicCommand {
    public type: PowerInquiredType = PowerInquiredType.LEFT_RIGHT_BATTERY;

    public static fromBuffer(reader: ReadBuffer): PowerStatusLeftRight {
        return new PowerStatusLeftRight({
            value: reader.readUInt8(),
            status: reader.readUInt8()
        }, {
            value: reader.readUInt8(),
            status: reader.readUInt8()
        });
    }

    constructor(

        public left: EarphoneStatus,
        public right: EarphoneStatus
    ) {
        super();

        assertEnumValue(BatteryChargingStatus, left.status);
        assertEnumValue(BatteryChargingStatus, right.status);
    }

    public getData() {
        return {
            left: Object.assign({}, this.left, {
                status: BatteryChargingStatus[this.left.status]
            }),
            right: Object.assign({}, this.right, {
                status: BatteryChargingStatus[this.right.status]
            }),
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.left.value);
        writer.writeUInt8(this.left.status);

        writer.writeUInt8(this.right.value);
        writer.writeUInt8(this.right.status);

        return writer.toBuffer();
    }
}