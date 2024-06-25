import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { PowerInquiredType } from "./enum";
import { PowerStatusBattery, PowerStatusBatteryWithThreshold, PowerStatusEnabled, PowerStatusLeftRight, PowerStatusLRWithThreshold, PowerStatusPayload } from "./status";

export class PowerRetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.POWER_RET_STATUS;

    public static fromBuffer(buffer: Buffer): PowerRetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.POWER_RET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType: PowerInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case PowerInquiredType.BATTERY:
            case PowerInquiredType.CRADLE_BATTERY:
                return new PowerRetStatus(PowerStatusBattery.fromBuffer(inquiredType, reader));
            case PowerInquiredType.LEFT_RIGHT_BATTERY:
                return new PowerRetStatus(PowerStatusLeftRight.fromBuffer(reader));
            case PowerInquiredType.AUTO_POWER_OFF:
            case PowerInquiredType.AUTO_POWER_OFF_WEARING_DETECTION:
            case PowerInquiredType.POWER_SAVE_MODE:
            case PowerInquiredType.LINK_CONTROL:
            case PowerInquiredType.CARING_CHARGE:
            case PowerInquiredType.BT_STANDBY:
                return new PowerRetStatus(PowerStatusEnabled.fromBuffer(inquiredType, reader));
            case PowerInquiredType.BATTERY_WITH_THRESHOLD:
            case PowerInquiredType.CRADLE_BATTERY_WITH_THRESHOLD:
                return new PowerRetStatus(PowerStatusBatteryWithThreshold.fromBuffer(inquiredType, reader));
            case PowerInquiredType.LR_BATTERY_WITH_THRESHOLD:
                return new PowerRetStatus(PowerStatusLRWithThreshold.fromBuffer(reader));
        }

        if (!reader.isEnd()) {
            throw new Error('Buffer not fully read');
        }

        throw new Error('Unsupported inquiredType type');
    }

    constructor(
        public payload: PowerStatusPayload
    ) {
        super();
    }

    public getData() {
        return {
            type: PowerInquiredType[this.payload.type],
            payload: this.payload.getData ? this.payload.getData() : null
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.payload.type);
        writer.writeBuffer(this.payload.toBuffer());

        return writer.toBuffer();
    }
}

// export * from './Playback';
// export * from './Volume';
// export * from './VolumeWithMute';
