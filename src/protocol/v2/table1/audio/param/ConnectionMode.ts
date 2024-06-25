import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { AudioInquiredType } from "../enum/AudioInquiredType";
import { PriorMode } from "../enum/PriorMode";

type SupportedInquiredType = AudioInquiredType.CONNECTION_MODE | AudioInquiredType.CONNECTION_MODE_WITH_LDAC_STATUS;

export class AudioParamConnectionMode extends BasicCommand {
    public static fromBuffer(inquiredType: SupportedInquiredType, reader: ReadBuffer): AudioParamConnectionMode {
        return new AudioParamConnectionMode(inquiredType, reader.readUInt8());
    }

    constructor(
        public type: SupportedInquiredType,
        public priorMode: PriorMode
    ) {
        super();

        assertEnumValue(PriorMode, priorMode);
    }

    public getData() {
        return {
            priorMode: PriorMode[this.priorMode]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.priorMode);

        return writer.toBuffer();
    }
}