import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { ConnectInquired } from "../../table1/connect/enum";
import { FunctionsTable2 } from "../functions";
import { CommandTable2 } from "../table";

interface FunctionEntry {
    func: FunctionsTable2,
    capability: number
}

export class ConnectRetSupportFunctionTable2 extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR_NO2;
    public command: CommandTable2 = CommandTable2.CONNECT_RET_SUPPORT_FUNCTION;

    public static fromBuffer(buffer: Buffer): ConnectRetSupportFunctionTable2 {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable2.CONNECT_RET_SUPPORT_FUNCTION) {
            throw new Error('Invalid data');
        }

        if (reader.readUInt8() !== ConnectInquired.FIXED_VALUE) {
            throw new Error('Invalid data');
        }

        const functions: FunctionEntry[] = [];

        const count = reader.readUInt8();
        for (let i = 0; i < count; i++) {
            const func: FunctionsTable2 = reader.readUInt8();
            const capability: number = reader.readUInt8();

            functions.push({ func, capability });
        }

        if (!reader.isEnd()) {
            throw new Error('Not end of buffer');
        }

        return new ConnectRetSupportFunctionTable2(functions);
    }

    constructor(public functions: FunctionEntry[]) {
        super();

        for (const { func } of functions) {
            assertEnumValue(FunctionsTable2, func);
        }
    }

    public getData() {
        return this.functions.map((data) => {
            return Object.assign({}, data, {
                func: FunctionsTable2[data.func]
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