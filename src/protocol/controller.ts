import { IBluetoothConnector } from "../connector";
import { Frame, FrameDataType } from "./frame";
import { RawMessage } from "./raw";
import { Sequence } from "./sequence";
import { ProtocolStream } from "./stream";
import { AbstractCommand, Command } from "./v2";

//Data -> Frames
export class ProtocolController {
    private stream: ProtocolStream;
    private connector: IBluetoothConnector;
    private sequence: Sequence;

    constructor(connector: IBluetoothConnector) {
        this.connector = connector;
        this.stream = new ProtocolStream();
        this.sequence = new Sequence(this);

        this.connector.on('data', this.onDataReceive.bind(this));
        this.stream.on('message', this.onFrameReceived.bind(this));
    }

    public async sendFrameImmediatly(frame: Frame) {
        // console.log('Snd Frame', frame.toString())
        const buffer = frame.toRaw();

        await this.connector.write(buffer);
    }

    public async diconnect() {
        await this.connector.close();
    }

    public sendRawMessage(message: RawMessage) {
        return this.sequence.sendRawMessage(message);
    }

    public invoke<W = AbstractCommand>(command: AbstractCommand): Promise<void> {
        console.log('Invk', command.toString());

        const message = new RawMessage(command.dataType, command.toBuffer());

        return this.sendRawMessage(message);
    }

    public invokeAndReceive<W extends typeof AbstractCommand, T = InstanceType<W>>(waitFor: W, command: AbstractCommand): Promise<NonNullable<T>> {
        const promise = new Promise<NonNullable<T>>(resolve => {
            const stream = this.stream;

            function receive(command: T) {
                if (command instanceof waitFor) {
                    stream.removeListener('command', receive);

                    return resolve(command);
                }
            }

            stream.on('command', receive);
        });

        this.invoke(command);

        return promise;
    }

    public invokeAndFilter<W extends typeof AbstractCommand, T = InstanceType<W>, R = T>(filter: ((command: T) => R), command: AbstractCommand): Promise<NonNullable<R>> {
        const promise = new Promise<NonNullable<R>>(resolve => {
            const stream = this.stream;

            function receive(command: T) {
                const result = filter(command);

                if (result) {
                    return resolve(result);
                }

                return;
            }

            stream.on('command', receive);
        });

        this.invoke(command);

        return promise;
    }

    public onDataReceive(data: Buffer) {
        this.stream.emit('data', data);
    }

    private onFrameReceived(rawFrame: Buffer) {
        const frame = Frame.fromRaw(rawFrame);
        // console.log('Rcv Frame', frame.toString());

        if (frame.dataType === FrameDataType.ACK) {
            return this.sequence.receiveAck(frame.sequenceNumber);
        }

        const command = Command.getCommand(frame.dataType, frame.payload);

        if (command) {
            console.log('Rcv Cmd', command.toString());
            this.stream.emit('command', command);
        } else {
            let cmdName: string = Command.getCommandName(frame.dataType, frame.payload) ?? '???';
            console.log('Unrecognized commmand', cmdName);
        }

        this.sequence.sendAckToFrame(frame);
    }
}