import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { SonyStringUTF8 } from "../../../utils/string";
import { DeviceInfoType } from "../enum";

const supportedDeviceInfoType = [
    DeviceInfoType.FW_VERSION, DeviceInfoType.INSTRUCTION_GUIDE, DeviceInfoType.MODEL_NAME
] as const;

type SupportedDeviceInfoType = typeof supportedDeviceInfoType[number];

export class ConnectInfoString extends BasicCommand {
    public static fromBuffer(infoType: SupportedDeviceInfoType, reader: ReadBuffer): ConnectInfoString {
        return new ConnectInfoString(
            infoType,
            SonyStringUTF8.read(reader)
        );
    }

    constructor(
        public type: SupportedDeviceInfoType,
        public value: string
    ) {
        super();

        if (!supportedDeviceInfoType.includes(type)) {
            throw new Error('Unsupported deviceInfo type');
        }
    }

    public getData() {
        return {
            value: this.value
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyStringUTF8.write(writer, this.value);

        return writer.toBuffer();
    }
}