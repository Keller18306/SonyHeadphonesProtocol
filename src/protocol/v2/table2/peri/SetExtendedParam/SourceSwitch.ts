import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { PeripheralInquiredType } from "../enum/PeripheralInquiredType";

export class PeriSetExtendedParamSourceSwitch extends BasicCommand {
    public type: PeripheralInquiredType = PeripheralInquiredType.SOURCE_SWITCH_CONTROL_CLASSIC_BT;

    public static fromBuffer(reader: ReadBuffer): PeriSetExtendedParamSourceSwitch {
        return new PeriSetExtendedParamSourceSwitch(
            reader.readString(17, 'utf8')
        );
    }

    constructor(public address: string) {
        super();
    }

    public getData() {
        return {
            address: this.address
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeString(this.address, 'utf8');

        return writer.toBuffer();
    }
}