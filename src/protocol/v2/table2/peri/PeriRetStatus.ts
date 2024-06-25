import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { SonyBool } from "../../SonyBool";
import { CommandTable2 } from "../table";
import { PeripheralBluetoothMode } from "./enum/PeripheralBluetoothMode";
import { PeripheralInquiredType } from "./enum/PeripheralInquiredType";

export class PeriRetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR_NO2;
    public command: CommandTable2 = CommandTable2.PERI_RET_STATUS;

    public static fromBuffer(buffer: Buffer): PeriRetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable2.PERI_RET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType: PeripheralInquiredType = reader.readUInt8()

        return new PeriRetStatus(
            inquiredType,
            reader.readUInt8(),
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        public inquiredType: PeripheralInquiredType,
        public mode: PeripheralBluetoothMode,
        public status: boolean
    ) {
        super();

        assertEnumValue(PeripheralInquiredType, inquiredType);
        assertEnumValue(PeripheralBluetoothMode, mode);

        if (![
            PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_CLASSIC_BT,
            PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_WITH_BLUETOOTH_CLASS_OF_DEVICE_CLASSIC_BT
        ].includes(inquiredType)) {
            throw new Error('Invalid inquiredType');
        }
    }

    public getData() {
        return {
            inquiredType: PeripheralInquiredType[this.inquiredType],
            mode: PeripheralBluetoothMode[this.mode],
            status: this.status
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);
        writer.writeUInt8(this.mode);
        SonyBool.toWriter(writer, this.status);

        return writer.toBuffer();
    }
}