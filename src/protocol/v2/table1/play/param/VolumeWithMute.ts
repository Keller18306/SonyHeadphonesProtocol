import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { PlayInquiredType } from "../enum/PlayInquiredType";

type SupportedType = PlayInquiredType.MUSIC_VOLUME_WITH_MUTE | PlayInquiredType.CALL_VOLUME_WITH_MUTE;

export class PlayParamVolumeWithMute extends BasicCommand {
    public type: SupportedType;

    public static fromBuffer(type: SupportedType, reader: ReadBuffer): PlayParamVolumeWithMute {
        const volume = reader.readUInt8();
        const mute = SonyBool.fromReader(reader);

        return new PlayParamVolumeWithMute(type, volume, mute);
    }

    constructor(
        type: SupportedType,
        public volume: number, public mute: boolean
    ) {
        super();

        this.type = type;
    }

    public getData() {
        return {
            volume: this.volume,
            mute: this.mute
        };
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.volume);
        writer.writeBuffer(SonyBool.toBuffer(this.mute));

        return writer.toBuffer();
    }
}