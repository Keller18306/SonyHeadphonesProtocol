import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { PlayInquiredType } from "./enum/PlayInquiredType";

export class PlayGetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.PLAY_GET_STATUS;

    public static fromBuffer(buffer: Buffer): PlayGetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.PLAY_GET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType = reader.readUInt8();

        if (inquiredType !== PlayInquiredType.PLAYBACK_CONTROL_WITH_CALL_VOLUME_ADJUSTMENT) {
            throw new Error('Unsupported playInquiredType type');
        }

        return new PlayGetStatus(inquiredType);
    }

    constructor(public inquiredType: PlayInquiredType) {
        super();

        assertEnumValue(PlayInquiredType, inquiredType);

        if (inquiredType !== PlayInquiredType.PLAYBACK_CONTROL_WITH_CALL_VOLUME_ADJUSTMENT) {
            throw new Error('Unsupported playInquiredType type');
        }
    }

    public getData() {
        return {
            inquiredType: PlayInquiredType[this.inquiredType]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        return writer.toBuffer();
    }
}
