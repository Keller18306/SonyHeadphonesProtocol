import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { AudioInquiredType } from "../enum/AudioInquiredType";
import { UpscalingTypeAutoOff } from "../enum/UpscalingTypeAutoOff";

export class AudioParamUpscaling extends BasicCommand {
    public type: AudioInquiredType = AudioInquiredType.UPSCALING;

    public static fromBuffer(reader: ReadBuffer): AudioParamUpscaling {
        return new AudioParamUpscaling(reader.readUInt8());
    }

    constructor(public status: UpscalingTypeAutoOff) {
        super();

        assertEnumValue(UpscalingTypeAutoOff, status);
    }

    public getData() {
        return {
            status: UpscalingTypeAutoOff[this.status]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.status);

        return writer.toBuffer();
    }
}