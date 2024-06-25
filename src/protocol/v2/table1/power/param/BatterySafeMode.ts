import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { PowerInquiredType } from "../enum";

export class PowerParamBatterySafeMode extends BasicCommand {
    public type: PowerInquiredType = PowerInquiredType.BATTERY_SAFE_MODE;

    public static fromBuffer(reader: ReadBuffer): PowerParamBatterySafeMode {
        return new PowerParamBatterySafeMode(
            SonyBool.fromReader(reader),
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        public enabled: boolean,
        public nowActive: boolean
    ) {
        super();
    }

    public getData() {
        return {
            enabled: this.enabled,
            nowActive: this.nowActive
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.enabled);
        SonyBool.toWriter(writer, this.nowActive);

        return writer.toBuffer();
    }
}