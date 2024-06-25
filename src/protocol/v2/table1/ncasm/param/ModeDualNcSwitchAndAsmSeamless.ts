import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { AmbientSoundMode } from "../enum/AmbientSoundMode";
import { NcAsmInquiredType } from "../enum/NcAsmInquiredType";
import { NcAsmMode } from "../enum/NcAsmMode";
import { ValueChangeStatus } from "../enum/ValueChangeStatus";

export class NcAsmSetParamModeDualNcSwitchAndAsmSeamless extends BasicCommand {
    public type: NcAsmInquiredType = NcAsmInquiredType.MODE_NC_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS;

    public static fromBuffer(reader: ReadBuffer): NcAsmSetParamModeDualNcSwitchAndAsmSeamless {
        const changeStatus: ValueChangeStatus = reader.readUInt8();

        const enabled = reader.readBool();
        const mode: NcAsmMode = reader.readUInt8();

        const ambientSoundMode: AmbientSoundMode = reader.readUInt8();
        const ambientSoundValue: number = reader.readUInt8();

        return new NcAsmSetParamModeDualNcSwitchAndAsmSeamless(
            enabled,
            mode, ambientSoundMode, ambientSoundValue,
            changeStatus
        );
    }

    constructor(
        public enabled: boolean,
        public mode: NcAsmMode,
        public ambientSoundMode: AmbientSoundMode,
        public ambientSoundValue: number,
        public changeStatus: ValueChangeStatus = ValueChangeStatus.CHANGED
    ) {
        super();

        assertEnumValue(NcAsmMode, mode);
        assertEnumValue(AmbientSoundMode, ambientSoundMode);
        assertEnumValue(ValueChangeStatus, changeStatus);
    }

    public getData() {
        return {
            changeStatus: ValueChangeStatus[this.changeStatus],
            enabled: this.enabled,
            mode: NcAsmMode[this.mode],
            ambientSoundMode: AmbientSoundMode[this.ambientSoundMode],
            ambientSoundValue: this.ambientSoundValue
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.changeStatus);

        writer.writeBool(this.enabled);
        writer.writeUInt8(this.mode);

        writer.writeUInt8(this.ambientSoundMode);
        writer.writeUInt8(this.ambientSoundValue);

        return writer.toBuffer();
    }
}