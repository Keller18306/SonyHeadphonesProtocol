import { Frame, FrameDataType } from "./frame";
import { RawMessage } from "./raw";
import { Sequence } from "./sequence";
import { ProtocolStream } from "./stream";
import { AbstractCommand, Command, ConnectGetProtocolInfo, ConnectRetProtocolInfo } from "./v2";

type WriterFunction = (buffer: Buffer) => Promise<void>
type CloseFunction = () => Promise<void>

interface ProtocolControllerOptions {
    write: WriterFunction,
    close: CloseFunction
}


//Data -> Frames
export class ProtocolController {
    private stream: ProtocolStream;
    private args: ProtocolControllerOptions;
    private sequence: Sequence;

    constructor(args: ProtocolControllerOptions) {
        this.args = args;
        this.stream = new ProtocolStream();
        this.sequence = new Sequence(this);

        this.stream.on('message', this.onFrameReceived.bind(this))
    }

    public async init() {
        //send init

        const response = await this.invokeAndReceive(
            ConnectRetProtocolInfo, new ConnectGetProtocolInfo()
        );
    }

    public async sendFrameImmediatly(frame: Frame) {
        console.log('Snd Frame', frame.toString())
        const buffer = frame.toRaw();

        await this.args.write(buffer);
    }

    public async diconnect() {
        await this.args.close()
    }

    public sendRawMessage(message: RawMessage) {
        return this.sequence.sendRawMessage(message);
    }

    public invoke<W = AbstractCommand>(command: AbstractCommand): Promise<void> {
        console.log('Invk', command.toString());

        const message = new RawMessage(command.dataType, command.toBuffer());

        return this.sendRawMessage(message);
    }

    public invokeAndReceive<W extends typeof AbstractCommand, T = InstanceType<W>>(waitFor: W, command: AbstractCommand): Promise<T> {
        const promise = new Promise<T>(resolve => {
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

    public onDataReceive(data: Buffer) {
        this.stream.emit('data', data);
    }

    private onFrameReceived(rawFrame: Buffer) {
        const frame = Frame.fromRaw(rawFrame);
        console.log('Rcv Frame', frame.toString());

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