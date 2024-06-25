import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { LogInquiredType } from "../enum/LogInquiredType";

type LogType = [string, string]

export class LogNtfyParamOperation extends BasicCommand {
    public type: LogInquiredType = LogInquiredType.TIME_SERIES_OPERATIONLOG_NOTIFIER;

    public static fromBuffer(reader: ReadBuffer): LogNtfyParamOperation {
        const a = reader.readString(reader.readUInt8());
        const b = reader.readString(reader.readUInt8());

        const list: LogType[] = [];
        const count = reader.readUInt8();
        for (let i = 0; i < count; i++) {
            const a = reader.readString(reader.readUInt8());
            const b = reader.readString(reader.readUInt8());

            list.push([a, b]);
        }

        return new LogNtfyParamOperation(a, b, list);
    }

    constructor(
        public a: string,
        public b: string,
        public list: LogType[]
    ) {
        super();
    }

    public getData() {
        return {
            a: this.a,
            b: this.b,
            list: this.list
        };
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.a.length);
        writer.writeString(this.a, 'utf8');

        writer.writeUInt8(this.b.length);
        writer.writeString(this.b, 'utf8');

        writer.writeUInt8(this.list.length);
        if (this.list.length) {
            for (const [a, b] of this.list) {
                writer.writeUInt8(a.length);
                writer.writeString(a, 'utf8');

                writer.writeUInt8(b.length);
                writer.writeString(b, 'utf8');
            }
        }

        return writer.toBuffer();
    }
}