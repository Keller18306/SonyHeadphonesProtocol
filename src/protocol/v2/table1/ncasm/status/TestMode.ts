import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { NcAsmInquiredType } from "../enum/NcAsmInquiredType";

export class NcAsmStatusTestMode extends BasicCommand {
    public type: NcAsmInquiredType = NcAsmInquiredType.NC_TEST_MODE;

    public static fromBuffer(reader: ReadBuffer): NcAsmStatusTestMode {
        return new NcAsmStatusTestMode(SonyBool.fromReader(reader));
    }

    constructor(public testMode: boolean) {
        super();
    }

    public getData() {
        return {
            testMode: this.testMode
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.testMode);

        return writer.toBuffer();
    }
}