import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { LEAInquiredType } from "../enum/LEAInquiredType";
import { StreamingStatus } from "../enum/StreamingStatus";

interface Streaming {
    left: StreamingStatus,
    right: StreamingStatus
}

export class LeaNtfyStatusTws extends BasicCommand {
    public type: LEAInquiredType = LEAInquiredType.TWS_SUPPORTS_A2DP_LEA_UNI_LEA_BROAD_WITH_CTKD;

    public static fromBuffer(reader: ReadBuffer): LeaNtfyStatusTws {
        return new LeaNtfyStatusTws(
            SonyBool.fromReader(reader),
            {
                left: reader.readUInt8(),
                right: reader.readUInt8()
            }
        );
    }

    constructor(
        public status: boolean,
        public streaming: Streaming
    ) {
        super();

        assertEnumValue(StreamingStatus, streaming.left);
        assertEnumValue(StreamingStatus, streaming.right);
    }

    public getData() {
        return {
            status: this.status,
            streaming: Object.assign({}, this.streaming, {
                left: StreamingStatus[this.streaming.left],
                right: StreamingStatus[this.streaming.right]
            })
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.status);
        writer.writeUInt8(this.streaming.left);
        writer.writeUInt8(this.streaming.right);

        return writer.toBuffer();
    }
}