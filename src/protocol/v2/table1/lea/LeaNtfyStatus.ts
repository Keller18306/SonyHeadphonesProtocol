import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { LEAInquiredType } from "./enum/LEAInquiredType";
import { LeaNtfyStatusEnabled } from "./NtfyStatus/Enabled";
import { LeaNtfyStatusHbs } from "./NtfyStatus/Hbs";
import { LeaNtfyStatusQuickAccess } from "./NtfyStatus/QuickAccess";
import { LeaNtfyStatusReason } from "./NtfyStatus/Reason";
import { LeaNtfyStatusTws } from "./NtfyStatus/Tws";

type LeaNtfyStatusPayload = LeaNtfyStatusTws | LeaNtfyStatusHbs | LeaNtfyStatusQuickAccess | LeaNtfyStatusEnabled | LeaNtfyStatusReason;

export class LeaNtfyStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.LEA_NTFY_STATUS;

    public static fromBuffer(buffer: Buffer): LeaNtfyStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.LEA_NTFY_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType: LEAInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case LEAInquiredType.TWS_SUPPORTS_A2DP_LEA_UNI_LEA_BROAD_WITH_CTKD:
                return new LeaNtfyStatus(LeaNtfyStatusTws.fromBuffer(reader));
            case LEAInquiredType.HBS_SUPPORTS_A2DP_LEA_UNI_LEA_BROAD_WITH_CTKD:
                return new LeaNtfyStatus(LeaNtfyStatusHbs.fromBuffer(reader));
            case LEAInquiredType.QUICK_ACCESS_CANT_BE_USED_WITH_LEA_CONNECTION:
                return new LeaNtfyStatus(LeaNtfyStatusQuickAccess.fromBuffer(reader));
            case LEAInquiredType.CLASSIC_ONLY_LE_CLASSIC_SETTING:
            case LEAInquiredType.PAIRING_DEVICE_MANAGEMENT_CANT_BE_USED_WITH_LEA_CONNECTION:
            case LEAInquiredType.SOUND_AR_CANT_BE_USED_WITH_LEA_CONNECTION:
            case LEAInquiredType.AUTO_PLAY_CANT_BE_USED_WITH_LEA_CONNECTION:
            case LEAInquiredType.GATT_CONNECTABLE_CANT_BE_USED_WITH_LEA_CONNECTION:
                return new LeaNtfyStatus(LeaNtfyStatusEnabled.fromBuffer(inquiredType, reader));
            case LEAInquiredType.BGM_MODE_CANT_BE_USED_WITH_LEA_CONNECTION:
            case LEAInquiredType.HEAD_TRACKER_CANT_BE_USED_WITH_LEA_CONNECTION:
            case LEAInquiredType.SOUND_AR_OPTIMIZATION_CANT_BE_USED_WITH_LEA_CONNECTION:
            case LEAInquiredType.CONNECTION_MODE_CANT_BE_USED_WITH_LEA_CONNECTION:
            case LEAInquiredType.VOICE_ASSISTANT_SETTINGS_CANT_BE_USED_WITH_LEA_CONNECTION:
            case LEAInquiredType.VOICE_ASSISTANT_WAKE_WORD_CANT_BE_USED_WITH_LEA_CONNECTION:
                return new LeaNtfyStatus(LeaNtfyStatusReason.fromBuffer(inquiredType, reader));
        }

        throw new Error('Unsupported inquiredType type');
    }

    constructor(
        public payload: LeaNtfyStatusPayload
    ) {
        super();
    }

    public getData() {
        return {
            inquiredType: LEAInquiredType[this.payload.type],
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