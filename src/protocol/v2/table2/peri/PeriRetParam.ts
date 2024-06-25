import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable2 } from "../table";
import { PeripheralInquiredType } from "./enum/PeripheralInquiredType";
import { PeriParamClassicBt } from "./Param/ClassicBt";
import { PeriParamClassicBtWithClassName } from "./Param/ClassicBtWithClassName";
import { PeriParamSourceSwitch } from "./Param/SourceSwitch";

export type PeriRetParamPayload = PeriParamClassicBt | PeriParamClassicBtWithClassName | PeriParamSourceSwitch;

export class PeriRetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR_NO2;
    public command: CommandTable2 = CommandTable2.PERI_RET_PARAM;

    public static fromBuffer(buffer: Buffer): PeriRetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable2.PERI_RET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: PeripheralInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_CLASSIC_BT:
                return new PeriRetParam(PeriParamClassicBt.fromBuffer(reader));
            case PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_WITH_BLUETOOTH_CLASS_OF_DEVICE_CLASSIC_BT:
                return new PeriRetParam(PeriParamClassicBtWithClassName.fromBuffer(reader));
            case PeripheralInquiredType.SOURCE_SWITCH_CONTROL_CLASSIC_BT:
                return new PeriRetParam(PeriParamSourceSwitch.fromBuffer(reader));
        }

        throw new Error('Invalid inquiredType');
    }

    constructor(public payload: PeriRetParamPayload) {
        super();

        assertEnumValue(PeripheralInquiredType, payload.type);
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