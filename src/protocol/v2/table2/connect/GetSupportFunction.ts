import { ReadBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { ConnectInquired } from "../../table1/connect/enum";
import { CommandTable2 } from "../table";

export class ConnectGetSupportFunctionTable2 extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR_NO2;
    public command: CommandTable2 = CommandTable2.CONNECT_GET_SUPPORT_FUNCTION;

    public static fromBuffer(buffer: Buffer): ConnectGetSupportFunctionTable2 {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable2.CONNECT_GET_SUPPORT_FUNCTION) {
            throw new Error('Invalid data');
        }

        if (reader.readUInt8() !== ConnectInquired.FIXED_VALUE) {
            throw new Error('Invalid data');
        }

        return new ConnectGetSupportFunctionTable2();
    }

    public getData() {
        return null;
    }

    public toBuffer(): Buffer {
        return Buffer.from([this.command, ConnectInquired.FIXED_VALUE]);
    }
}