import EventEmitter from 'events';
import { ReadBuffer } from '../src/utils/buffer';

type Frame = {
    id?: number,
    received: boolean,
    data: Buffer,
    timestamp: Date
}

type Connection = {
    connectionId: number,
    address: string,
    channels: {
        scid: Record<number, { protocol: number }>,
        dcid: Record<number, { protocol: number }>
    },
    deviceName(): string
}

enum L2CAP_Protocol {
    "SPD" = 0x0001,
    "RFCOMM" = 0x0003,
    "TCS-BIN" = 0x0005,
    "TCS-BIN-CORDLESS" = 0x0007,
    "BNEP" = 0x000F,
    "HID-Control" = 0x0011,
    "HID-Interrupt" = 0x0013,
    "UPnP" = 0x0015,
    "AVCTP-Control" = 0x0017,
    "AVDTP" = 0x0019,
    "AVCTP-Browsing" = 0x001B,
    "UDI_C-Plane" = 0x001D,
    "ATT" = 0x001F,
    "3DSP" = 0x0021,
    "IPSP" = 0x0023,
    "OTS" = 0x0025,
    "EATT" = 0x0027
}

export type RFCOMMData = {
    timestamp: Date
    connection: Connection,
    btsnoop: { frameId: number, received: boolean }
    direction: { src: string, dst: string },
    rfcomm: { channel: number, data: Buffer }
}

export class Btsnoop extends EventEmitter {

    private headerRead: boolean = false;
    private frameId: number = 0;

    private connections: Record<number, Connection> = {};
    private connectionDeviceName: Record<string, string> = {};
    private deviceInfo: { address?: string, name: string } = {
        name: 'localhost'
    }
    private l2capFragmentedData: Record<number, { total: number, buffer: Buffer }> = {};
    private _data: Buffer = Buffer.alloc(0);

    constructor() {
        super();
    }

    public onRawData(data: Buffer) {
        this._data = Buffer.concat([this._data, data]);

        const reader = new ReadBuffer(this._data);

        if (!this.headerRead) {
            this._readHeader(reader);
            this.headerRead = true;
        }

        this._readData(reader);

        this._data = reader.readPadding();
    }

    private _readData(reader: ReadBuffer) {
        let frame: Frame | null;

        while (frame = this._readFrame(reader)) {
            const { received, data } = frame;
            this.frameId += 1;

            frame.id = this.frameId;

            const buffer = new ReadBuffer(data);
            const type = buffer.readUInt8();

            switch (type) {
                //HCI COMMAND
                case 0x01: {
                    this._readHciCommand(buffer);

                    break;
                }

                //ACL DATA
                case 0x02: {
                    this._readAclData(buffer, frame);

                    break;
                }

                //HCI EVENT
                case 0x04: {
                    this._readHciEvent(buffer);

                    break;
                }
            }
        }
    }

    private _readHeader(reader: ReadBuffer): void {
        const header = new ReadBuffer(reader.readBuffer(16));

        if (header.readBuffer(8).toString() !== 'btsnoop\x00') {
            throw new Error('Not btsnoop header');
        }

        if (header.readUInt32BE() !== 1) {
            throw new Error('Unsuppoorted version');
        }

        header.readUInt32BE(); //type
    }

    private _readFrame(reader: ReadBuffer): Frame | null {
        if (reader.isEnd()) {
            return null;
        }

        const HEADER_LENGTH = 24;

        try {
            const header = new ReadBuffer(reader.copy().readBuffer(HEADER_LENGTH));

            const originalLength = header.readUInt32BE();
            const includedLength = header.readUInt32BE();
            const flags = header.readUInt32BE();
            const drops = header.readUInt32BE();

            if (originalLength != includedLength) {
                throw new Error('originalLength not equal includedLength');
            }

            const timestampUnix = Number((header.readBigUInt64BE() - 0x00dcddb30f2f8000n) / 1000n);
            const timestamp = new Date(timestampUnix);

            const direction = Boolean(flags & (1 << 0)); // 0 - sent | 1 - received
            // const command = Boolean(flags & (1 << 1)); // 0 - data | 1 - command/event

            if (reader.remain < (HEADER_LENGTH + includedLength)) {
                return null;
            }

            const data = reader.skip(HEADER_LENGTH).readBuffer(includedLength);

            return { received: direction, data, timestamp }
        } catch (e) {
            return null;
        }
    }

    private _readMacAddress(reader: ReadBuffer): string {
        return Array.from(reader.readBuffer(6)).reverse().map((byte) => {
            return byte.toString(16).padStart(2, '0');
        }).join(':');
    }

    private _readHciCommand(buffer: ReadBuffer): void {
        const cmd = buffer.readUInt16LE();

        //device name
        if (cmd === 0x0c13) {
            const length = buffer.readUInt8();
            const name = buffer.readString(length, 'utf8').replace(/\x00/g, '');
            this.deviceInfo.name = name;
        }
    }

    private _readHciEvent(buffer: ReadBuffer): void {
        const event = buffer.readUInt8();

        switch (event) {
            //CONNECT COMPLETED
            case 0x03: {
                buffer.skip(2);

                const connectionId = buffer.readUInt16LE();
                const address = this._readMacAddress(buffer);

                this.connections[connectionId] = {
                    connectionId, address,
                    channels: { scid: {}, dcid: {} },
                    deviceName: (): string => {
                        return this.connectionDeviceName[address];
                    }
                };
                // console.log('CONNECT', connectionId, address);
                break;
            }

            //REMOTE NAME
            case 0x07: {
                const length = buffer.readUInt8();
                buffer.skip(1);
                const address = this._readMacAddress(buffer);
                const name = buffer.readString(length - 1 - 6, 'utf8').replace(/\x00/g, '');

                this.connectionDeviceName[address] = name;
                // console.log('NAME', address, name);
                break;
            }

            //COMMAND COMPLETED
            case 0x0e: {
                const data = new ReadBuffer(buffer.readBuffer(buffer.readUInt8()));

                data.skip(1);

                const cmd = data.readUInt16LE();

                if (cmd === 0x1009) {
                    data.skip(1);

                    const address = this._readMacAddress(data);

                    this.deviceInfo.address = address;
                }

                break;
            }
        }
    }

    private _readAclData(buffer: ReadBuffer, frame: Frame): void {
        const headerData = buffer.readUInt16LE();

        const connectionId = headerData & ~((1 << 12) | (1 << 13) | (1 << 14) | (1 << 15));
        const pbFlag = (headerData >> 12) & ((1 << 0) | (1 << 1));

        const aclDataLength = buffer.readUInt16LE();
        let aclData: Buffer = buffer.readBuffer(aclDataLength);

        let fragmented: boolean = false;

        switch (pbFlag) {
            case 0x01: /* Continuation fragment */
                fragmented = true;
                break;
            case 0x00: /* First fragment/packet, non-auto flushable */
            case 0x02: /* First fragment/packet, auto flushable */
                const l2capDataLength = new ReadBuffer(aclData).readUInt16LE(0);
                fragmented = (l2capDataLength + 4 != aclDataLength);
                break;
        }

        if (fragmented) {
            const l2capFragmentedData = this.l2capFragmentedData[connectionId];

            if (pbFlag !== 0x01) {
                //first fragment
                if (l2capFragmentedData) {
                    throw new Error('L2CAP NOT FULLY COMPLETED');
                }

                const l2capDataLength = new ReadBuffer(aclData).readUInt16LE(0);

                this.l2capFragmentedData[connectionId] = {
                    total: l2capDataLength + 4,
                    buffer: aclData
                }

                return;
            } else {
                //continue
                if (!l2capFragmentedData) {
                    throw new Error('L2CAP FRAGMENT NOT CREATED')
                }

                l2capFragmentedData.buffer = Buffer.concat([
                    l2capFragmentedData.buffer, aclData
                ]);
            }

            if (l2capFragmentedData.buffer.length >= l2capFragmentedData.total) {
                if (l2capFragmentedData.buffer.length > l2capFragmentedData.total) {
                    throw new Error('l2cap fragmented buffers is too large');
                }

                //bufferCompleted
                aclData = l2capFragmentedData.buffer;
                delete this.l2capFragmentedData[connectionId];
            } else {
                return;
            }
        }

        this._readL2CapData(connectionId, new ReadBuffer(aclData), frame);
    }

    private _readL2CapData(connectionId: number, l2cap: ReadBuffer, frame: Frame): void {
        const length = l2cap.readUInt16LE();
        const cid = l2cap.readUInt16LE();
        const buffer = new ReadBuffer(l2cap.readBuffer(length));

        const connection = this.connections[connectionId];
        if (!connection) {
            return;
            // throw new Error(`Connection id ${connectionId} not found`);
        }

        const destination = frame.received ? 'dcid' : 'scid';
        const revertedDestination = !frame.received ? 'dcid' : 'scid';

        if (cid === 0x1) {
            const commandCode = buffer.readUInt8();
            buffer.skip(1);

            const commandData = new ReadBuffer(buffer.readBuffer(buffer.readUInt16LE()));

            switch (commandCode) {
                //connection request
                case 0x2: {
                    const protocol = commandData.readUInt16LE();
                    const sourceCid = commandData.readUInt16LE();

                    if (connection.channels[destination][sourceCid]) {
                        throw new Error('Already defined');
                    }

                    connection.channels[destination][sourceCid] = { protocol };

                    // console.log(received ? 'recv' : 'sent', 'request', L2CAP_Protocol[protocol], {
                    //     [destination]: sourceCid.toString(16)
                    // });

                    break;
                }

                //connection response
                case 0x3: {
                    const destinationCid = commandData.readUInt16LE();
                    const sourceCid = commandData.readUInt16LE();

                    const result = commandData.readUInt16LE();
                    if (result !== 0) {
                        return;
                    }

                    if (connection.channels[destination][destinationCid]) {
                        throw new Error('Already defined');
                    }

                    const sourceChannel = connection.channels[revertedDestination][sourceCid];

                    connection.channels[destination][destinationCid] = sourceChannel;

                    // console.log(received ? 'recv' : 'sent', 'response', L2CAP_Protocol[sourceChannel.protocol], {
                    //     [destination]: destinationCid.toString(16),
                    //     [revertedDestination]: sourceCid.toString(16)
                    // })

                    break;
                }
            }
        } else if (connection && connection.channels[revertedDestination][cid]?.protocol === L2CAP_Protocol.RFCOMM) {
            //RFCOMM
            this._readRfcommData(connection, buffer, frame);
        }
    }

    private _readRfcommData(connection: Connection, buffer: ReadBuffer, frame: Frame): void {
        const addressInfo = buffer.readUInt8();
        const control = buffer.readUInt8();

        const channel = (addressInfo >> 3);
        const frameType = control & ~(1 << 4);
        const pf = Boolean(control & (1 << 4));

        let length = buffer.readUInt8();
        if (length & 0x1) {
            //one octet
            length = length >> 1;
        } else {
            //two octet
            length = (length >> 1) | (buffer.readUInt8() << 7)
        }

        if (pf) {
            buffer.skip(1);
        }

        const data = buffer.readBuffer(length);

        if (frameType === 0xef && channel !== 0) {
            let src: string;
            let dst: string;

            if (frame.received) {
                //received (from connected device)
                src = connection.deviceName();
                dst = this.deviceInfo.name;
            } else {
                //sent (to connected device)
                src = this.deviceInfo.name;
                dst = connection.deviceName();
            }

            const eventData: RFCOMMData = {
                timestamp: frame.timestamp,
                connection,
                btsnoop: { frameId: this.frameId, received: frame.received },
                direction: { src, dst },
                rfcomm: { channel, data }
            }

            this.emit('rfcomm', eventData);
        }

        buffer.skip(1);

        if (!buffer.isEnd()) {
            throw new Error('rfcom error, not end of data')
        }
    }
}