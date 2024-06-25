import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { EqEbbInquiredType } from "../enum/EqEbbInquiredType";

export class EqEbbParamEbb extends BasicCommand {
    public type: EqEbbInquiredType = EqEbbInquiredType.EBB;

    public static fromBuffer(reader: ReadBuffer): EqEbbParamEbb {
        return new EqEbbParamEbb(reader.readUInt8());
    }

    constructor(public level: number) {
        super();
    }

    public getData() {
        return {
            level: this.level
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.level);

        return writer.toBuffer();
    }
}