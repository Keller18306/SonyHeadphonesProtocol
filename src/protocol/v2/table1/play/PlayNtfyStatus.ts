import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { SonyBool } from "../../SonyBool";
import { CommandTable1 } from "../table";
import { MusicCallStatus } from "./enum/MusicCallStatus";
import { PlaybackStatus } from "./enum/PlaybackStatus";
import { PlayInquiredType } from "./enum/PlayInquiredType";

export class PlayNtfyStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.PLAY_NTFY_STATUS;

    public static fromBuffer(buffer: Buffer): PlayNtfyStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.PLAY_NTFY_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType = reader.readUInt8();

        if (inquiredType !== PlayInquiredType.PLAYBACK_CONTROL_WITH_CALL_VOLUME_ADJUSTMENT) {
            throw new Error('Unsupported playInquiredType type');
        }

        return new PlayNtfyStatus(inquiredType,
            SonyBool.fromReader(reader),
            reader.readUInt8(),
            reader.readUInt8()
        );
    }

    constructor(
        public inquiredType: PlayInquiredType,
        public allowControl: boolean,
        public playbackStatus: PlaybackStatus,
        public musicCallStatus: MusicCallStatus
    ) {
        super();

        assertEnumValue(PlayInquiredType, inquiredType);
        assertEnumValue(PlaybackStatus, playbackStatus);
        assertEnumValue(MusicCallStatus, musicCallStatus);

        if (inquiredType !== PlayInquiredType.PLAYBACK_CONTROL_WITH_CALL_VOLUME_ADJUSTMENT) {
            throw new Error('Unsupported inquiredType type');
        }
    }

    public getData() {
        return {
            inquiredType: PlayInquiredType[this.inquiredType],
            allowControl: this.allowControl,
            playbackStatus: PlaybackStatus[this.playbackStatus],
            musicCallStatus: MusicCallStatus[this.musicCallStatus]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);
        SonyBool.toWriter(writer, this.allowControl);
        writer.writeUInt8(this.playbackStatus);
        writer.writeUInt8(this.musicCallStatus);

        return writer.toBuffer();
    }
}
