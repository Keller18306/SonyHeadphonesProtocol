import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { LogInquiredType } from "../enum/LogInquiredType";

export class LogNtfyParamAction extends BasicCommand {
    public type: LogInquiredType = LogInquiredType.ACTION_LOG_NOTIFIER;

    public static fromBuffer(reader: ReadBuffer): LogNtfyParamAction {
        const value = reader.readString(reader.readUInt16BE());

        return new LogNtfyParamAction(value);
    }

    constructor(public value: string) {
        super();
    }

    public getData() {
        return this.value;
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt16BE(this.value.length);
        writer.writeString(this.value);

        return writer.toBuffer();
    }
}