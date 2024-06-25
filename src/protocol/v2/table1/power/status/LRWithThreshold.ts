import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { BatteryChargingStatus } from "../enum/BatteryChargingStatus";
import { PowerInquiredType } from "../enum/PowerInquiredType";
import { EarphoneStatus } from "./LeftRight";

interface LRThreshold {
    left: number,
    right: number
}

export class PowerStatusLRWithThreshold extends BasicCommand {
    public type: PowerInquiredType = PowerInquiredType.LR_BATTERY_WITH_THRESHOLD;

    public static fromBuffer(reader: ReadBuffer): PowerStatusLRWithThreshold {
        return new PowerStatusLRWithThreshold({
            value: reader.readUInt8(),
            status: reader.readUInt8()
        }, {
            value: reader.readUInt8(),
            status: reader.readUInt8()
        }, {
            left: reader.readUInt8(),
            right: reader.readUInt8()
        });
    }

    constructor(
        public left: EarphoneStatus,
        public right: EarphoneStatus,
        public threshold: LRThreshold

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
            threshold: this.threshold
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.left.value);
        writer.writeUInt8(this.left.status);

        writer.writeUInt8(this.right.value);
        writer.writeUInt8(this.right.status);

        writer.writeUInt8(this.threshold.left);
        writer.writeUInt8(this.threshold.right);

        return writer.toBuffer();
    }
}