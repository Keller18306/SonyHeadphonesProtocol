import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { PowerInquiredType } from "./enum";
import { PowerParamAutoPowerOff, PowerParamAutoPowerOffWearingDetection, PowerParamBatterySafeMode, PowerParamEnabled, PowerParamPayload } from "./param";

export class PowerNtfyParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.POWER_NTFY_PARAM;

    public static fromBuffer(buffer: Buffer): PowerNtfyParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.POWER_NTFY_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: PowerInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case PowerInquiredType.AUTO_POWER_OFF:
                return new PowerNtfyParam(PowerParamAutoPowerOff.fromBuffer(reader));
            case PowerInquiredType.AUTO_POWER_OFF_WEARING_DETECTION:
                return new PowerNtfyParam(PowerParamAutoPowerOffWearingDetection.fromBuffer(reader));
            case PowerInquiredType.POWER_SAVE_MODE:
            case PowerInquiredType.CARING_CHARGE:
            case PowerInquiredType.BT_STANDBY:
                return new PowerNtfyParam(PowerParamEnabled.fromBuffer(inquiredType, reader));
            case PowerInquiredType.BATTERY_SAFE_MODE:
                return new PowerNtfyParam(PowerParamBatterySafeMode.fromBuffer(reader));
        }

        throw new Error('Unsupported inquiredType');
    }

    constructor(
        public payload: PowerParamPayload
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