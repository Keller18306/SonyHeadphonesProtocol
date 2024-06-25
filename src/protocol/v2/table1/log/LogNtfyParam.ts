import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { LogInquiredType } from "./enum/LogInquiredType";
import { LogNtfyParamAction } from "./NtfyParam/ActionLog";
import { LogNtfyParamOperation } from "./NtfyParam/OperationLog";

type LogNtfyParamPayload = LogNtfyParamAction | LogNtfyParamOperation;

export class LogNtfyParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.LOG_NTFY_PARAM;

    public static fromBuffer(buffer: Buffer): LogNtfyParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.LOG_NTFY_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: LogInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case LogInquiredType.ACTION_LOG_NOTIFIER:
                return new LogNtfyParam(LogNtfyParamAction.fromBuffer(reader));
            case LogInquiredType.TIME_SERIES_OPERATIONLOG_NOTIFIER: {
                return new LogNtfyParam(LogNtfyParamOperation.fromBuffer(reader));
            }
        }

        throw new Error('Unsupported inquiredType type');
    }

    constructor(
        public payload: LogNtfyParamPayload
    ) {
        super();
    }

    public getData() {
        return {
            type: LogInquiredType[this.payload.type],
            payload: this.payload.getData ? this.payload.getData() : null
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.payload.type);
        writer.writeBuffer(this.payload.toBuffer());

        return writer.toBuffer();
    }
}

export * from './NtfyParam/ActionLog';
export * from './NtfyParam/OperationLog';

