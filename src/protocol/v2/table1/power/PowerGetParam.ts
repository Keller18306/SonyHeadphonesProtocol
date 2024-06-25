import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { PowerInquiredType } from "./enum";

const supportedInquiredType: PowerInquiredType[] = [
    PowerInquiredType.AUTO_POWER_OFF, PowerInquiredType.AUTO_POWER_OFF_WEARING_DETECTION,
    PowerInquiredType.POWER_SAVE_MODE, PowerInquiredType.CARING_CHARGE,
    PowerInquiredType.BT_STANDBY, PowerInquiredType.BATTERY_SAFE_MODE
];

export class PowerGetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.POWER_GET_PARAM;

    public static fromBuffer(buffer: Buffer): PowerGetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.POWER_GET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: PowerInquiredType = reader.readUInt8();

        return new PowerGetParam(inquiredType);
    }

    constructor(public inquiredType: PowerInquiredType) {
        super();

        assertEnumValue(PowerInquiredType, inquiredType);

        if (!supportedInquiredType.includes(inquiredType)) {
            throw new Error('Unsupported inquiredType');
        }
    }

    public getData() {
        return {
            inquiredType: PowerInquiredType[this.inquiredType],
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        return writer.toBuffer();
    }
}