import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { DeviceInfoType } from "./enum";
import { ConnectInfoInstruction, ConnectInfoModel, ConnectInfoPayload, ConnectInfoString } from "./info";

export class ConnectRetDeviceInfo extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.CONNECT_RET_DEVICE_INFO;

    public static fromBuffer(buffer: Buffer): ConnectRetDeviceInfo {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.CONNECT_RET_DEVICE_INFO) {
            throw new Error('Invalid data');
        }

        const infoType: DeviceInfoType = reader.readUInt8();

        switch (infoType) {
            case DeviceInfoType.FW_VERSION:
            case DeviceInfoType.MODEL_NAME:
                return new ConnectRetDeviceInfo(ConnectInfoString.fromBuffer(infoType, reader));
            case DeviceInfoType.SERIES_AND_COLOR_INFO:
                return new ConnectRetDeviceInfo(ConnectInfoModel.fromBuffer(reader));
            case DeviceInfoType.INSTRUCTION_GUIDE:
                return new ConnectRetDeviceInfo(ConnectInfoInstruction.fromBuffer(reader));
        }
    }

    constructor(public payload: ConnectInfoPayload) {
        super();

        assertEnumValue(DeviceInfoType, payload.type);
    }

    public getData() {
        return {
            inquiredType: DeviceInfoType[this.payload.type],
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