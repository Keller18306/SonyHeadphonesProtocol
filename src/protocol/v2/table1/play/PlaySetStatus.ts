import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { SonyBool } from "../../SonyBool";
import { CommandTable1 } from "../table";
import { PlaybackControl } from "./enum/PlaybackControl";
import { PlayInquiredType } from "./enum/PlayInquiredType";

export class PlaySetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.PLAY_SET_STATUS;

    public static fromBuffer(buffer: Buffer): PlaySetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.PLAY_SET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType = reader.readUInt8();

        if (inquiredType !== PlayInquiredType.PLAYBACK_CONTROL_WITH_CALL_VOLUME_ADJUSTMENT) {
            throw new Error('Unsupported playInquiredType type');
        }

        if (SonyBool.fromReader(reader) !== true) {
            throw new Error('Wrong status');
        }

        const playbackControl: PlaybackControl = reader.readUInt8();

        return new PlaySetStatus(inquiredType, playbackControl);
    }

    constructor(
        public inquiredType: PlayInquiredType,
        public playbackControl: PlaybackControl
    ) {
        super();

        assertEnumValue(PlayInquiredType, inquiredType);
        assertEnumValue(PlaybackControl, playbackControl);

        if (inquiredType !== PlayInquiredType.PLAYBACK_CONTROL_WITH_CALL_VOLUME_ADJUSTMENT) {
            throw new Error('Unsupported playInquiredType type');
        }

        if (![
            PlaybackControl.PAUSE,
            PlaybackControl.TRACK_UP,
            PlaybackControl.TRACK_DOWN,
            PlaybackControl.PLAY
        ].includes(playbackControl)) {
            throw new Error('Unsupported playbackControl type');
        }
    }

    public getData() {
        return {
            inquiredType: PlayInquiredType[this.inquiredType],
            playbackControl: PlaybackControl[this.playbackControl]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);
        SonyBool.toWriter(writer, true);
        writer.writeUInt8(this.playbackControl);

        return writer.toBuffer();
    }
}
