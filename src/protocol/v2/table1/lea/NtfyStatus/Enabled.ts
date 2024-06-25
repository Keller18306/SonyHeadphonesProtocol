import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { LEAInquiredType } from "../enum/LEAInquiredType";

type SupportedType = LEAInquiredType.CLASSIC_ONLY_LE_CLASSIC_SETTING | LEAInquiredType.PAIRING_DEVICE_MANAGEMENT_CANT_BE_USED_WITH_LEA_CONNECTION |
    LEAInquiredType.SOUND_AR_CANT_BE_USED_WITH_LEA_CONNECTION | LEAInquiredType.AUTO_PLAY_CANT_BE_USED_WITH_LEA_CONNECTION |
    LEAInquiredType.GATT_CONNECTABLE_CANT_BE_USED_WITH_LEA_CONNECTION;

export class LeaNtfyStatusEnabled extends BasicCommand {
    public type: SupportedType;

    public static fromBuffer(type: SupportedType, reader: ReadBuffer): LeaNtfyStatusEnabled {
        return new LeaNtfyStatusEnabled(
            type,
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        type: SupportedType,
        public value: boolean
    ) {
        super();

        this.type = type;
    }

    public getData() {
        return {
            value: this.value
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.value);

        return writer.toBuffer();
    }
}