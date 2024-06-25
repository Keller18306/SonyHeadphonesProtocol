import { ReadBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable2 } from "../table";
import { VoiceGuidanceInquiredType } from "./enum/InquiredType";

export class VoiceGuidanceGetExtendedParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR_NO2;
    public command: CommandTable2 = CommandTable2.VOICE_GUIDANCE_GET_EXTENDED_PARAM;

    public static fromBuffer(buffer: Buffer): VoiceGuidanceGetExtendedParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable2.VOICE_GUIDANCE_GET_EXTENDED_PARAM) {
            throw new Error('Invalid data');
        }

        return new VoiceGuidanceGetExtendedParam(reader.readUInt8());
    }

    constructor(public inquiredType: VoiceGuidanceInquiredType) {
        super();

        assertEnumValue(VoiceGuidanceInquiredType, inquiredType);
    }

    public getData() {
        return {
            inquiredType: VoiceGuidanceInquiredType[this.inquiredType]
        }
    }

    public toBuffer(): Buffer {
        return Buffer.from([this.command, this.inquiredType]);
    }
}