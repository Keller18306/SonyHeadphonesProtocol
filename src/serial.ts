import * as btSerial from "bluetooth-serial-port";
import { ProtocolController } from "./protocol";

console.log('Start')
const port = new btSerial.BluetoothSerialPort();

function write(buffer: Buffer): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        port.write(buffer, (err) => {
            if (err) return reject(err);

            resolve();
        });
    });
}

async function close(): Promise<void> {
    port.close()
}

const controller = new ProtocolController({ write, close });

port.on('data', controller.onDataReceive.bind(controller));

export async function connectToSerial(address: string) {
    console.log('Getting serial channel...');

    const channel = await new Promise<number>((resolve, reject) => {
        port.findSerialPortChannel(address, resolve, reject);
    });

    console.log('Serial is', channel);

    console.log('Connecting to', address, 'channel', channel);

    await new Promise<void>((resolve, reject) => {
        port.connect(address, channel, resolve, reject);
    })

    console.log('Connected');
    await controller.init();

    return controller;
}

// export async function pairedDevices() {

// }

// port.listPairedDevices((devices: any[]) => {
//     const device = devices.find((device) => {
//         return device.name === 'WF-1000XM4';
//     })

//     console.log(device)
// })

// port.on('found', (address, name) => {
//     console.log(address, name);
// })

// port.inquireSync()