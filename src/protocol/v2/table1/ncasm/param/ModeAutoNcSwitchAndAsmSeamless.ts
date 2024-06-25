import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { AmbientSoundMode } from "../enum/AmbientSoundMode";
import { NcAsmInquiredType } from "../enum/NcAsmInquiredType";
import { NcAsmMode } from "../enum/NcAsmMode";
import { NcValue } from "../enum/NcValue";
import { ValueChangeStatus } from "../enum/ValueChangeStatus";

type SupportedInquiredType = NcAsmInquiredType.MODE_NC_ASM_AUTO_NC_MODE_SWITCH_AND_ASM_SEAMLESS |
    NcAsmInquiredType.MODE_NC_ASM_DUAL_SINGLE_NC_MODE_SWITCH_AND_ASM_SEAMLESS;

export class NcAsmSetParamModeAutoNcSwitchAndAsmSeamless extends BasicCommand {
    public static fromBuffer(inquiredType: SupportedInquiredType, reader: ReadBuffer): NcAsmSetParamModeAutoNcSwitchAndAsmSeamless {
        const changeStatus: ValueChangeStatus = reader.readUInt8();

        const enabled = reader.readBool();
        const mode: NcAsmMode = reader.readUInt8();
        const ncValue: NcValue = reader.readUInt8();

        const ambientSoundMode: AmbientSoundMode = reader.readUInt8();
        const ambientSoundValue: number = reader.readUInt8();

        return new NcAsmSetParamModeAutoNcSwitchAndAsmSeamless(
            inquiredType,
            enabled,
            mode, ncValue, ambientSoundMode, ambientSoundValue,
            changeStatus
        );
    }

    constructor(
        public type: SupportedInquiredType,
        public enabled: boolean,
        public mode: NcAsmMode,
        public ncValue: NcValue,
        public ambientSoundMode: AmbientSoundMode,
        public ambientSoundValue: number,
        public changeStatus: ValueChangeStatus = ValueChangeStatus.CHANGED
    ) {
        super();

        assertEnumValue(NcAsmMode, mode);
        assertEnumValue(NcValue, ncValue);
        assertEnumValue(AmbientSoundMode, ambientSoundMode);
        assertEnumValue(ValueChangeStatus, changeStatus);
    }

    public getData() {
        return {
            changeStatus: ValueChangeStatus[this.changeStatus],
            enabled: this.enabled,
            mode: NcAsmMode[this.mode],
            ncValue: NcValue[this.ncValue],
            ambientSoundMode: AmbientSoundMode[this.ambientSoundMode],
            ambientSoundValue: this.ambientSoundValue
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.changeStatus);

        writer.writeBool(this.enabled);
        writer.writeUInt8(this.mode);
        writer.writeUInt8(this.ncValue);

        writer.writeUInt8(this.ambientSoundMode);
        writer.writeUInt8(this.ambientSoundValue);

        return writer.toBuffer();
    }
}