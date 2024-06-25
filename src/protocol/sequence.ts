import { OutsidePromise, createPromise } from "../utils/promise";
import { ProtocolController } from "./controller";
import { Frame, FrameDataType, isAckRequired } from "./frame";
import { RawMessage } from "./raw";

export class Sequence {
    private sequenceNumber: number = 0;
    private _waitAck: boolean = false;

    private retryCount: number = 10;
    private retryTimeout: number = 750;

    private _ackPromise?: OutsidePromise<void>;
    private _framePromise?: Promise<void>;

    constructor(private protocol: ProtocolController) { }

    public receiveAck(sequenceNumber: number) {
        if (this.sequenceNumber === sequenceNumber) {
            console.log('invalid seq received')

            return;
        }

        this.sequenceNumber = sequenceNumber;
        this._waitAck = false;

        if (this._ackPromise) {
            this._ackPromise.resolve();
            this._ackPromise = undefined;
        }
    }

    public sendAckToFrame(frame: Frame) {
        if (!isAckRequired(frame.dataType)) {
            return;
        }

        const ack = new Frame(FrameDataType.ACK, this.invert(frame.sequenceNumber));

        this.protocol.sendFrameImmediatly(ack);
    }

    public async sendRawMessage(message: RawMessage) {
        this._framePromise = this.sendMessageWithAckWait(message);

        return this._framePromise;
    }

    private async sendMessageWithAckWait({ dataType, payload }: RawMessage) {
        if (this._framePromise) {
            await this._framePromise;
        }

        const frame = new Frame(dataType, this.sequenceNumber, payload);

        const send = () => {
            return this.protocol.sendFrameImmediatly(frame);
        }

        await new Promise(r => setTimeout(r, 2e3));

        await send();

        this._waitAck = isAckRequired(dataType);

        let retry: number = 0;
        while (this._waitAck) {
            while (!await this.waitAck(this.retryTimeout)) {
                if (retry >= this.retryCount) {
                    throw new Error('No ACK to message');
                }

                console.log('Resend frame', frame);

                retry += 1;
                await send();
            }
        }
    }

    private waitAck(timeout: number): Promise<boolean> {
        if (!this._ackPromise) {
            this._ackPromise = createPromise();
        }

        return new Promise<boolean>(resolve => {
            this._ackPromise?.promise.then(() => {
                resolve(true);
            })

            setTimeout(() => {
                resolve(false);
            }, timeout);
        })
    }

    private invert(seq: number) {
        return (1 - seq) & 255;
    }
}