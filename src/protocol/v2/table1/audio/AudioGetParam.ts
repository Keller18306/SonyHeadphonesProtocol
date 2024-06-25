import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { AudioInquiredType } from "./enum/AudioInquiredType";

export class AudioGetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.AUDIO_GET_PARAM;

    public static fromBuffer(buffer: Buffer): AudioGetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.AUDIO_GET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: AudioInquiredType = reader.readUInt8();

        return new AudioGetParam(inquiredType);
    }

    constructor(public inquiredType: AudioInquiredType) {
        super();

        assertEnumValue(AudioInquiredType, inquiredType);
    }

    public getData() {
        return {
            inquiredType: AudioInquiredType[this.inquiredType]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        return writer.toBuffer();
    }
}