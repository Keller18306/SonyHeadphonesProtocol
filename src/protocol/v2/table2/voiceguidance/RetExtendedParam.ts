import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { SonyStringUTF8 } from "../../utils/string";
import { CommandTable2 } from "../table";
import { VoiceGuidanceInquiredType } from "./enum/InquiredType";
import { VoiceGuidanceLanguage } from "./enum/Language";
import { VoiceGuidanceLanguageItem } from "./types/LanguageItem";

export class VoiceGuidanceRetExtendedParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR_NO2;
    public command: CommandTable2 = CommandTable2.VOICE_GUIDANCE_RET_EXTENDED_PARAM;

    public static fromBuffer(buffer: Buffer): VoiceGuidanceRetExtendedParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable2.VOICE_GUIDANCE_RET_EXTENDED_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: VoiceGuidanceInquiredType = reader.readUInt8();

        if (inquiredType === VoiceGuidanceInquiredType.MTK_TRANSFER_WO_DISCONNECTION_SUPPORT_LANGUAGE_SWITCH) {
            const requiredTime = reader.readUInt8();

            const categoryId = SonyStringUTF8.read(reader);
            const serialNumber = SonyStringUTF8.read(reader);

            const threshold = reader.readUInt8(); // 0 - 100
            const thresholdForInterrupt = reader.readUInt8(); // 0 - 100

            if (threshold > 100 || thresholdForInterrupt > 100) {
                throw new Error('threshold invalid range');
            }

            const uniqueId = SonyStringUTF8.read(reader);

            const languages: VoiceGuidanceLanguageItem[] = [];

            const numberOfServiceId = reader.readUInt8();
            for (let i = 0; i < numberOfServiceId; i++) {
                const lang: VoiceGuidanceLanguage = reader.readUInt8();
                const serviceId = SonyStringUTF8.read(reader);

                languages.push(new VoiceGuidanceLanguageItem(lang, serviceId));
            }

            return new VoiceGuidanceRetExtendedParam(
                inquiredType, requiredTime,
                categoryId, serialNumber,
                threshold, thresholdForInterrupt,
                uniqueId, languages
            );
        }

        throw new Error('Invalid inquiredType');
    }

    constructor(
        public inquiredType: VoiceGuidanceInquiredType, public requiredTime: number,
        public categoryId: string, public serialNumber: string,
        public threshold: number, public thresholdForInterrupt: number,
        public uniqueId: string, public languages: VoiceGuidanceLanguageItem[]
    ) {
        super();
    }

    public getData() {
        return {
            inquiredType: VoiceGuidanceInquiredType[this.inquiredType],
            requiredTime: this.requiredTime,
            categoryId: this.categoryId,
            serialNumber: this.serialNumber,
            threshold: this.threshold,
            thresholdForInterrupt: this.thresholdForInterrupt,
            uniqueId: this.uniqueId,
            languages: this.languages.map((data) => {
                return Object.assign({}, data, {
                    lang: VoiceGuidanceLanguage[data.lang]
                })
            })
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        writer.writeUInt8(this.requiredTime);

        SonyStringUTF8.write(writer, this.categoryId);
        SonyStringUTF8.write(writer, this.serialNumber);

        writer.writeUInt8(this.threshold);
        writer.writeUInt8(this.thresholdForInterrupt);

        SonyStringUTF8.write(writer, this.uniqueId);

        writer.writeUInt8(this.languages.length);
        for (const { lang, serviceId } of this.languages) {
            writer.writeUInt8(lang);
            SonyStringUTF8.write(writer, serviceId);
        }

        return writer.toBuffer();
    }
}