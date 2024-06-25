import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { PowerInquiredType } from "../enum/PowerInquiredType";

type SupportedType = PowerInquiredType.POWER_SAVE_MODE | PowerInquiredType.CARING_CHARGE | PowerInquiredType.BT_STANDBY;

export class PowerParamEnabled extends BasicCommand {
    public type: SupportedType;

    public static fromBuffer(type: SupportedType, reader: ReadBuffer): PowerParamEnabled {
        return new PowerParamEnabled(
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