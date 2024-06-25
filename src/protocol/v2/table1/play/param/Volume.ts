import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { PlayInquiredType } from "../enum/PlayInquiredType";

type SupportedType = PlayInquiredType.MUSIC_VOLUME | PlayInquiredType.CALL_VOLUME;

export class PlayParamVolume extends BasicCommand {
    public type: SupportedType;

    public static fromBuffer(type: SupportedType, reader: ReadBuffer): PlayParamVolume {
        const volume = reader.readUInt8();

        return new PlayParamVolume(type, volume);
    }

    constructor(
        type: SupportedType,
        public volume: number
    ) {
        super();

        this.type = type;
    }

    public getData() {
        return this.volume;
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.volume);

        return writer.toBuffer();
    }
}