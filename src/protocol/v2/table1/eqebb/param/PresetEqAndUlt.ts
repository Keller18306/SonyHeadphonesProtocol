import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { EqEbbInquiredType } from "../enum/EqEbbInquiredType";
import { EqPresetId } from "../enum/EqPresetId";
import { EqUltModeStatus } from "../enum/EqUltModeStatus";

export class EqEbbParamPresetEqAndUlt extends BasicCommand {
    public type: EqEbbInquiredType = EqEbbInquiredType.PRESET_EQ_AND_ULT_MODE;

    public static fromBuffer(reader: ReadBuffer): EqEbbParamPresetEqAndUlt {
        const preset: EqPresetId = reader.readUInt8();
        const ultMode: EqUltModeStatus = reader.readUInt8();
        const bands: number[] = [];

        const count = reader.readUInt8();
        for (let i = 0; i < count; i++) {
            const band = reader.readUInt8();
            bands.push(band);
        }

        return new EqEbbParamPresetEqAndUlt(
            preset, ultMode, bands
        );
    }

    constructor(
        public preset: EqPresetId,
        public ultMode: EqUltModeStatus,
        public bands: number[]
    ) {
        super();

        assertEnumValue(EqPresetId, preset);
        assertEnumValue(EqUltModeStatus, ultMode);
    }

    public getData() {
        return {
            preset: EqPresetId[this.preset],
            ultMode: EqUltModeStatus[this.ultMode],
            bands: this.bands
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.preset);
        writer.writeUInt8(this.ultMode);

        writer.writeUInt8(this.bands.length);
        for (const band of this.bands) {
            writer.writeUInt8(band);
        }

        return writer.toBuffer();
    }
}