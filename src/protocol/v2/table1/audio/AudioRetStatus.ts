import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { AudioInquiredType } from "./enum/AudioInquiredType";
import { AudioStatusSupported } from "./status/Supported";
import { AudioStatusSupportedVisible } from "./status/SupportedVisible";

type AudioParamPayload = AudioStatusSupported | AudioStatusSupportedVisible;

export class AudioRetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.AUDIO_RET_STATUS;

    public static fromBuffer(buffer: Buffer): AudioRetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.AUDIO_RET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType: AudioInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case AudioInquiredType.CONNECTION_MODE:
            case AudioInquiredType.UPSCALING:
            case AudioInquiredType.BGM_MODE:
                return new AudioRetStatus(AudioStatusSupported.fromBuffer(inquiredType, reader));
            case AudioInquiredType.CONNECTION_MODE_WITH_LDAC_STATUS:
                return new AudioRetStatus(AudioStatusSupportedVisible.fromBuffer(reader));
        }

        throw new Error('Invalid inquiredType');
    }

    constructor(public payload: AudioParamPayload) {
        super();

        assertEnumValue(AudioInquiredType, payload.type);
    }

    public getData() {
        return {
            inquiredType: AudioInquiredType[this.payload.type],
            payload: this.payload.getData()
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