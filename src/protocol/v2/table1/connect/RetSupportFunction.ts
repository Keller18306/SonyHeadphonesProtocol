import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { FunctionsTable1 } from "../functions";
import { CommandTable1 } from "../table";
import { ConnectInquired } from "./enum";

interface FunctionEntry {
    func: FunctionsTable1,
    capability: number
}

export class ConnectRetSupportFunctionTable1 extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.CONNECT_RET_SUPPORT_FUNCTION;

    public static fromBuffer(buffer: Buffer): ConnectRetSupportFunctionTable1 {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.CONNECT_RET_SUPPORT_FUNCTION) {
            throw new Error('Invalid data');
        }

        if (reader.readUInt8() !== ConnectInquired.FIXED_VALUE) {
            throw new Error('Invalid data');
        }

        const functions: FunctionEntry[] = [];

        const count = reader.readUInt8();
        for (let i = 0; i < count; i++) {
            const func: FunctionsTable1 = reader.readUInt8();
            const capability: number = reader.readUInt8();

            functions.push({ func, capability });
        }

        if (!reader.isEnd()) {
            throw new Error('Not end of buffer');
        }

        return new ConnectRetSupportFunctionTable1(functions);
    }

    constructor(public functions: FunctionEntry[]) {
        super();

        for (const { func } of functions) {
            assertEnumValue(FunctionsTable1, func);
        }
    }

    public getData() {
        return this.functions.map((data) => {
            return Object.assign({}, data, {
                func: FunctionsTable1[data.func]
            });
        });
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(ConnectInquired.FIXED_VALUE);

        writer.writeUInt8(this.functions.length);
        for (const data of this.functions) {
            writer.writeUInt8(data.func);
            writer.writeUInt8(data.capability);
        }

        return writer.toBuffer();
    }
}