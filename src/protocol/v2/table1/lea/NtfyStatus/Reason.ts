import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { LEAInquiredType } from "../enum/LEAInquiredType";
import { UnavailableReason } from "../enum/UnavailableReason";

type SupportedType = LEAInquiredType.BGM_MODE_CANT_BE_USED_WITH_LEA_CONNECTION | LEAInquiredType.HEAD_TRACKER_CANT_BE_USED_WITH_LEA_CONNECTION |
    LEAInquiredType.SOUND_AR_OPTIMIZATION_CANT_BE_USED_WITH_LEA_CONNECTION | LEAInquiredType.CONNECTION_MODE_CANT_BE_USED_WITH_LEA_CONNECTION |
    LEAInquiredType.VOICE_ASSISTANT_SETTINGS_CANT_BE_USED_WITH_LEA_CONNECTION | LEAInquiredType.VOICE_ASSISTANT_WAKE_WORD_CANT_BE_USED_WITH_LEA_CONNECTION;

export class LeaNtfyStatusReason extends BasicCommand {
    public type: SupportedType;

    public static fromBuffer(type: SupportedType, reader: ReadBuffer): LeaNtfyStatusReason {
        return new LeaNtfyStatusReason(
            type,
            reader.readUInt8()
        );
    }

    constructor(
        type: SupportedType,
        public unavailableReason: UnavailableReason
    ) {
        super();

        this.type = type;

        assertEnumValue(UnavailableReason, unavailableReason);
    }

    public getData() {
        return {
            unavailableReason: UnavailableReason[this.unavailableReason]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.unavailableReason);

        return writer.toBuffer();
    }
}