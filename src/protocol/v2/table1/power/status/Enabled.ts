import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { PowerInquiredType } from "../enum/PowerInquiredType";

type SupportedType = PowerInquiredType.AUTO_POWER_OFF | PowerInquiredType.AUTO_POWER_OFF_WEARING_DETECTION |
    PowerInquiredType.POWER_SAVE_MODE | PowerInquiredType.LINK_CONTROL | PowerInquiredType.CARING_CHARGE
    | PowerInquiredType.BT_STANDBY;

export class PowerStatusEnabled extends BasicCommand {
    public type: SupportedType;

    public static fromBuffer(type: SupportedType, reader: ReadBuffer): PowerStatusEnabled {
        return new PowerStatusEnabled(
            type,
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        type: SupportedType,
        public enabled: boolean
    ) {
        super();

        this.type = type;
    }

    public getData() {
        return {
            enabled: this.enabled
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.enabled);

        return writer.toBuffer();
    }
}