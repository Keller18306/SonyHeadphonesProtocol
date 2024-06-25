import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { DeviceInfoType } from "./enum";

export class ConnectGetDeviceInfo extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.CONNECT_GET_DEVICE_INFO;

    public static fromBuffer(buffer: Buffer): ConnectGetDeviceInfo {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.CONNECT_GET_DEVICE_INFO) {
            throw new Error('Invalid data');
        }

        const infoType: DeviceInfoType = reader.readUInt8();

        return new ConnectGetDeviceInfo(infoType);
    }

    constructor(public infoType: DeviceInfoType) {
        super();

        assertEnumValue(DeviceInfoType, infoType);
    }

    public getData() {
        return {
            infoType: DeviceInfoType[this.infoType],
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.infoType);

        return writer.toBuffer();
    }
}