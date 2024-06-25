import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { AudioInquiredType } from "../enum/AudioInquiredType";

export class AudioStatusSupportedVisible extends BasicCommand {
    public type: AudioInquiredType = AudioInquiredType.CONNECTION_MODE_WITH_LDAC_STATUS;

    public static fromBuffer(reader: ReadBuffer): AudioStatusSupportedVisible {
        return new AudioStatusSupportedVisible(
            SonyBool.fromReader(reader),
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        public supported: boolean,
        public visible: boolean,
    ) {
        super();
    }

    public getData() {
        return {
            supported: this.supported,
            visible: this.visible
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.supported);
        SonyBool.toWriter(writer, this.visible);

        return writer.toBuffer();
    }
}