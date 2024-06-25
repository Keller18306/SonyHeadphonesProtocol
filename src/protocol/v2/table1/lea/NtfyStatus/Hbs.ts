import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { LEAInquiredType } from "../enum/LEAInquiredType";
import { StreamingStatus } from "../enum/StreamingStatus";

export class LeaNtfyStatusHbs extends BasicCommand {
    public type: LEAInquiredType = LEAInquiredType.HBS_SUPPORTS_A2DP_LEA_UNI_LEA_BROAD_WITH_CTKD;

    public static fromBuffer(reader: ReadBuffer): LeaNtfyStatusHbs {
        return new LeaNtfyStatusHbs(
            SonyBool.fromReader(reader),
            reader.readUInt8()
        );
    }

    constructor(
        public status: boolean,
        public streaming: StreamingStatus
    ) {
        super();

        assertEnumValue(StreamingStatus, streaming);
    }

    public getData() {
        return {
            status: this.status,
            streaming: StreamingStatus[this.streaming]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.status);
        writer.writeUInt8(this.streaming);

        return writer.toBuffer();
    }
}