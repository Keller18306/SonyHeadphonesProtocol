import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { AmbientSoundMode } from "../enum/AmbientSoundMode";
import { NcAsmInquiredType } from "../enum/NcAsmInquiredType";
import { ValueChangeStatus } from "../enum/ValueChangeStatus";

export class NcAsmSetParamNcSwitchAndAsmSeamless extends BasicCommand {
    public type: NcAsmInquiredType = NcAsmInquiredType.NC_ON_OFF_AND_ASM_SEAMLESS;

    public static fromBuffer(reader: ReadBuffer): NcAsmSetParamNcSwitchAndAsmSeamless {
        const changeStatus: ValueChangeStatus = reader.readUInt8();

        const noiseCancel: boolean = reader.readBool();

        const ambientSound: boolean = reader.readBool();
        const ambientSoundMode: AmbientSoundMode = reader.readUInt8();
        const ambientSoundValue: number = reader.readUInt8();

        return new NcAsmSetParamNcSwitchAndAsmSeamless(
            noiseCancel,
            ambientSound, ambientSoundMode, ambientSoundValue,
            changeStatus
        );
    }

    constructor(
        public noiseCancel: boolean,
        public ambientSound: boolean,
        public ambientSoundMode: AmbientSoundMode,
        public ambientSoundValue: number,
        public changeStatus: ValueChangeStatus = ValueChangeStatus.CHANGED
    ) {
        super();

        assertEnumValue(AmbientSoundMode, ambientSoundMode);
        assertEnumValue(ValueChangeStatus, changeStatus);
    }

    public getData() {
        return {
            changeStatus: ValueChangeStatus[this.changeStatus],
            noiseCancel: this.noiseCancel,
            ambientSound: this.ambientSound,
            ambientSoundMode: AmbientSoundMode[this.ambientSoundMode],
            ambientSoundValue: this.ambientSoundValue
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.changeStatus);

        writer.writeBool(this.noiseCancel);

        writer.writeBool(this.ambientSound);
        writer.writeUInt8(this.ambientSoundMode);
        writer.writeUInt8(this.ambientSoundValue);

        return writer.toBuffer();
    }
}