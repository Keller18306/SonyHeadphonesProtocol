import { assertEnumValue } from "../../../../../utils/enum";
import { EqBandInformationType } from "../enum/EqBandInformationType";
import { SpecificInformationType } from "../enum/SpecificInformationType";

export class BandInfo {
    public informationType: EqBandInformationType;
    public value: number;

    constructor(informationType: EqBandInformationType, value: number) {
        this.informationType = informationType;
        this.value = value;

        assertEnumValue(EqBandInformationType, informationType);

        const specificInformationType = this.specificInformationType;
        if (specificInformationType !== null) {
            assertEnumValue(SpecificInformationType, this.specificInformationType);
        }
    }

    public get specificInformationType(): SpecificInformationType | null {
        if (this.informationType !== EqBandInformationType.SPECIFIC_INFORMATION) {
            return null;
        }

        return this.value;
    }

    public get isClearBass() {
        return this.specificInformationType === SpecificInformationType.CLEAR_BASS;
    }

    public getData() {
        return {
            informationType: EqBandInformationType[this.informationType],
            specificInformationType: this.specificInformationType ? SpecificInformationType[this.specificInformationType] : null,
            isClearBass: this.isClearBass,
            value: this.value
        }
    }
}