import { VoiceGuidanceLanguage } from "../enum/Language";

export class VoiceGuidanceLanguageItem {
    constructor(public lang: VoiceGuidanceLanguage, public serviceId: string) { }
}