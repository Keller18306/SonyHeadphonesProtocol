import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyStringUTF8 } from "../../../utils/string";
import { PlaybackNameStatus } from "../enum/PlaybackNameStatus";
import { PlayInquiredType } from "../enum/PlayInquiredType";

interface PlaybackInfo {
    status: PlaybackNameStatus,
    value: string
}

export class PlayParamPlayback extends BasicCommand {
    public type: PlayInquiredType = PlayInquiredType.PLAYBACK_CONTROL_WITH_CALL_VOLUME_ADJUSTMENT;

    public static fromBuffer(reader: ReadBuffer): PlayParamPlayback {
        const playbackInfo: PlaybackInfo[] = [];

        for (let i = 0; i < 4; i++) {
            const status: PlaybackNameStatus = reader.readUInt8();
            const value = SonyStringUTF8.read(reader);

            playbackInfo.push({ status, value });
        }

        if (!reader.isEnd()) {
            throw new Error('Buffer not fully read')
        }

        return new PlayParamPlayback(playbackInfo);
    }

    constructor(public playbackInfo: PlaybackInfo[]) {
        super();

        if (playbackInfo.length !== 4) {
            throw new Error('Invalid playback data');
        }
    }

    public getData() {
        return this.playbackInfo.map((data) => {
            return Object.assign({}, data, {
                status: PlaybackNameStatus[data.status]
            });
        });
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        for (const { status, value } of this.playbackInfo) {
            writer.writeUInt8(status);
            SonyStringUTF8.write(writer, value);
        }

        return writer.toBuffer();
    }
}