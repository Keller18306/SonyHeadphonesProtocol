import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { PlayInquiredType } from "./enum/PlayInquiredType";

export class PlayGetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.PLAY_GET_PARAM;

    public static fromBuffer(buffer: Buffer): PlayGetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.PLAY_GET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType = reader.readUInt8();

        return new PlayGetParam(inquiredType);
    }

    constructor(public inquiredType: PlayInquiredType) {
        super();

        assertEnumValue(PlayInquiredType, inquiredType);
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
