import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable2 } from "../table";
import { PeriSetParamSourceSwitch } from "./SetParam";
import { PeripheralInquiredType } from "./enum/PeripheralInquiredType";

export class PeriSetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR_NO2;
    public command: CommandTable2 = CommandTable2.PERI_SET_PARAM;

    public static fromBuffer(buffer: Buffer): PeriSetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable2.PERI_SET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: PeripheralInquiredType = reader.readUInt8();

        if (inquiredType !== PeripheralInquiredType.SOURCE_SWITCH_CONTROL_CLASSIC_BT) {
            throw new Error('Invalid inquiredType');
        }

        return new PeriSetParam(PeriSetParamSourceSwitch.fromBuffer(reader));
    }

    constructor(public payload: PeriSetParamSourceSwitch) {
        super();

        assertEnumValue(PeripheralInquiredType, payload.type);

        if (payload.type !== PeripheralInquiredType.SOURCE_SWITCH_CONTROL_CLASSIC_BT) {
            throw new Error('Invalid inquiredType');
        }
    }

    public getData() {
        return {
            inquiredType: PeripheralInquiredType[this.payload.type],
            payload: this.payload.getData()
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