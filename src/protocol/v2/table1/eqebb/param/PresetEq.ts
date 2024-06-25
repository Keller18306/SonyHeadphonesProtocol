import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { EqEbbInquiredType } from "../enum/EqEbbInquiredType";
import { EqPresetId } from "../enum/EqPresetId";

type SupportedInquiredType = EqEbbInquiredType.PRESET_EQ | EqEbbInquiredType.PRESET_EQ_NONCUSTOMIZABLE;

export class EqEbbParamPresetEq extends BasicCommand {
    public static fromBuffer(inquiredType: SupportedInquiredType, reader: ReadBuffer): EqEbbParamPresetEq {
        const preset: EqPresetId = reader.readUInt8();
        const bands: number[] = [];

        const count = reader.readUInt8();
        for (let i = 0; i < count; i++) {
            const band = reader.readUInt8();
            bands.push(band);
        }

        return new EqEbbParamPresetEq(
            inquiredType, preset, bands
        );
    }

    constructor(
        public type: SupportedInquiredType,
        public preset: EqPresetId,
        public bands: number[]
    ) {
        super();

        assertEnumValue(EqPresetId, preset);
    }

    public getData() {
        return {
            preset: EqPresetId[this.preset],
            bands: this.bands
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.preset);

        writer.writeUInt8(this.bands.length);
        for (const band of this.bands) {
            writer.writeUInt8(band);
        }

        return writer.toBuffer();
    }
}