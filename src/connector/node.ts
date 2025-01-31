import * as btSerial from "bluetooth-serial-port";
import { EventEmitter } from "events";
import { IBluetoothConnector } from "./IBluetoothConnector";

export class BluetoothNodeConnector extends EventEmitter implements IBluetoothConnector {
    private port: btSerial.BluetoothSerialPort;

    constructor() {
        super();

        this.port = new btSerial.BluetoothSerialPort();

        this.port.on('data', this.emit.bind(this, 'data'));
    }

    public async getDeviceList() {
        const devices = await new Promise<{ name: string, address: string }[]>((resolve) => {
            this.port.listPairedDevices(resolve);
        });

        return devices.map(({ name, address }) => {
            return { name, address };
        });
    }

    public async connectByDeviceName(deviceName: string) {
        const devices = await this.getDeviceList();

        const device = devices.find((device) => {
            return device.name === deviceName;
        });

        if (!device) {
            throw new Error('Device not found');
        }

        return this.connectByMacAddress(device.address);
    }

    public async connectByMacAddress(address: string) {
        console.log('Getting serial channel...');

        const channel = await new Promise<number>((resolve, reject) => {
            this.port.findSerialPortChannel(address, resolve, reject);
        });

        console.log('Serial is', channel);

        console.log('Connecting to', address, 'channel', channel);

        await new Promise<void>((resolve, reject) => {
            this.port.connect(address, channel, resolve, reject);
        })
    }

    public async write(buffer: Buffer) {
        return new Promise<void>((resolve, reject) => {
            this.port.write(buffer, (err) => {
                if (err) return reject(err);

                resolve();
            });
        });
    }

    public async close() {
        this.port.close();
    }
}