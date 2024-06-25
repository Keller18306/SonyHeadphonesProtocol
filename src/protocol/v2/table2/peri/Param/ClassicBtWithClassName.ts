import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyStringUTF8 } from "../../../utils/string";
import { PeripheralInquiredType } from "../enum/PeripheralInquiredType";

interface PeriDevice {
    address: string,
    status: number,
    deviceClass: number, // скорее всего 0 - отключено, 1 - подключено, 2 - закреплено
    deviceName: string
}

export class PeriParamClassicBtWithClassName extends BasicCommand {
    public type: PeripheralInquiredType = PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_WITH_BLUETOOTH_CLASS_OF_DEVICE_CLASSIC_BT;

    public static fromBuffer(reader: ReadBuffer): PeriParamClassicBtWithClassName {
        const deviceCount: number = reader.readUInt8();

        const devices: PeriDevice[] = [];
        for (let i = 0; i < deviceCount; i++) {
            devices.push({
                address: reader.readString(17, 'utf8'),
                status: reader.readUInt8(),
                deviceClass: reader.readUInt24BE(),
                deviceName: SonyStringUTF8.read(reader)
            });
        }

        const playbackrightDeviceIndex = reader.readUInt8();

        if (!reader.isEnd()) {
            throw new Error('Not end of buffer');
        }

        return new PeriParamClassicBtWithClassName(devices, playbackrightDeviceIndex);
    }

    constructor(
        public devices: PeriDevice[],
        public playbackrightDeviceIndex: number
    ) {
        super();
    }

    public getPlaybackrightDevice(): PeriDevice {
        const device = this.devices.find(device => {
            return device.status === this.playbackrightDeviceIndex
        });

        if (!device) {
            throw new Error('The are no playing device');
        }

        return device;
    }


    public getData() {
        return {
            devices: this.devices,
            playbackrightDevice: this.getPlaybackrightDevice().deviceName + ` (${this.playbackrightDeviceIndex})`
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.devices.length);
        for (const device of this.devices) {
            writer.writeString(device.address, 'utf8');
            writer.writeUInt8(device.status);
            SonyStringUTF8.write(writer, device.deviceName);
        }

        writer.writeUInt8(this.playbackrightDeviceIndex);

        return writer.toBuffer();
    }
}