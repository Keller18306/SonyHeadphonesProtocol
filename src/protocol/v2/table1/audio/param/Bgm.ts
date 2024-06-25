import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { AudioInquiredType } from "../enum/AudioInquiredType";
import { RoomSize } from "../enum/RoomSize";

export class AudioParamBgm extends BasicCommand {
    public type: AudioInquiredType = AudioInquiredType.BGM_MODE;

    public static fromBuffer(reader: ReadBuffer): AudioParamBgm {
        return new AudioParamBgm(
            SonyBool.fromReader(reader),
            reader.readUInt8()
        );
    }

    constructor(
        public enabled: boolean,
        public roomSize: RoomSize
    ) {
        super();

        assertEnumValue(RoomSize, roomSize);
    }

    public getData() {
        return {
            enabled: this.enabled,
            roomSize: RoomSize[this.roomSize]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.enabled);
        writer.writeUInt8(this.roomSize);

        return writer.toBuffer();
    }
}