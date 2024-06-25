import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { LEAInquiredType } from "../enum/LEAInquiredType";
import { QuickAccessFunction } from "../enum/QuickAccessFunction";

type QuickAccessFunctions = Partial<Record<QuickAccessFunction, boolean>>;

export class LeaNtfyStatusQuickAccess extends BasicCommand {
    public type: LEAInquiredType = LEAInquiredType.HBS_SUPPORTS_A2DP_LEA_UNI_LEA_BROAD_WITH_CTKD;

    public static fromBuffer(reader: ReadBuffer): LeaNtfyStatusQuickAccess {
        const enabled = SonyBool.fromReader(reader);

        const quickAccessFunctions: QuickAccessFunctions = {}

        const count = reader.readUInt8();
        for (let i = 0; i < count; i++) {
            const func: QuickAccessFunction = reader.readUInt8();
            const status: boolean = SonyBool.fromReader(reader);

            quickAccessFunctions[func] = status;
        }

        return new LeaNtfyStatusQuickAccess(enabled, quickAccessFunctions);
    }

    constructor(
        public status: boolean,
        public quickAccessFunctions: QuickAccessFunctions
    ) {
        super();
    }

    public getData() {
        return {
            status: this.status,
            funcs: Object.fromEntries(Object.entries(this.quickAccessFunctions).map((data) => {
                data[0] = QuickAccessFunction[Number(data[0])];

                return data;
            }))
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.status);
        writer.writeUInt8(Object.keys(this.quickAccessFunctions).length);

        for (const [func, status] of Object.entries(this.quickAccessFunctions)) {
            writer.writeUInt8(Number(func));
            SonyBool.toWriter(writer, status);
        }

        return writer.toBuffer();
    }
}