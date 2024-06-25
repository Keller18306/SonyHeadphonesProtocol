import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { DeviceInfoType, GuidanceCategory } from "../enum";

export class ConnectInfoInstruction extends BasicCommand {
    public type: DeviceInfoType = DeviceInfoType.INSTRUCTION_GUIDE;

    public static fromBuffer(reader: ReadBuffer): ConnectInfoInstruction {
        const categories: GuidanceCategory[] = [];

        const count = reader.readUInt8();
        for (let i = 0; i < count; i++) {
            categories.push(reader.readUInt8());
        }

        if (!reader.isEnd()) {
            throw new Error('Not end of buffer');
        }

        return new ConnectInfoInstruction(categories);
    }

    constructor(public categories: GuidanceCategory[]) {
        super();

        for (const category of categories) {
            assertEnumValue(GuidanceCategory, category);
        }
    }

    public getData() {
        return this.categories.map((category) => {
            return GuidanceCategory[category];
        });
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.categories.length);
        for (const category of this.categories) {
            writer.writeUInt8(category);
        }

        return writer.toBuffer();
    }
}