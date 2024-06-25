import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { PlayInquiredType } from "./enum/PlayInquiredType";
import { PlayParamPayload, PlayParamPlayback, PlayParamVolume, PlayParamVolumeWithMute } from "./param";

export class PlayRetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.PLAY_RET_PARAM;

    public static fromBuffer(buffer: Buffer): PlayRetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.PLAY_RET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: PlayInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case PlayInquiredType.PLAYBACK_CONTROL_WITH_CALL_VOLUME_ADJUSTMENT:
                return new PlayRetParam(PlayParamPlayback.fromBuffer(reader));
            case PlayInquiredType.MUSIC_VOLUME:
            case PlayInquiredType.CALL_VOLUME:
                return new PlayRetParam(PlayParamVolume.fromBuffer(inquiredType, reader));
            case PlayInquiredType.MUSIC_VOLUME_WITH_MUTE:
            case PlayInquiredType.CALL_VOLUME_WITH_MUTE:
                return new PlayRetParam(PlayParamVolumeWithMute.fromBuffer(inquiredType, reader));
        }

        throw new Error('Unsupported playInquiredType type');
    }

    constructor(
        public payload: PlayParamPayload
    ) {
        super();
    }

    public getData() {
        return {
            type: PlayInquiredType[this.payload.type],
            payload: this.payload.getData ? this.payload.getData() : null
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.payload.type);
        writer.writeBuffer(this.payload.toBuffer());

        return writer.toBuffer();
    }
}
