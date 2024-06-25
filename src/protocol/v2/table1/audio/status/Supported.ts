import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { AudioInquiredType } from "../enum/AudioInquiredType";

type SupportedInquiredType = AudioInquiredType.CONNECTION_MODE | AudioInquiredType.UPSCALING | AudioInquiredType.BGM_MODE;

export class AudioStatusSupported extends BasicCommand {
    public static fromBuffer(inquiredType: SupportedInquiredType, reader: ReadBuffer): AudioStatusSupported {
        return new AudioStatusSupported(
            inquiredType,
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        public type: SupportedInquiredType,
        public supported: boolean
    ) {
        super();
    }

    public getData() {
        return {
            supported: this.supported
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.supported);

        return writer.toBuffer();
    }
}