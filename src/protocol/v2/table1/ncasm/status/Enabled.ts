import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { BasicCommand } from "../../../basic";
import { SonyBool } from "../../../SonyBool";
import { NcAsmInquiredType } from "../enum/NcAsmInquiredType";

type SupportedInquiredType = NcAsmInquiredType.NC_ON_OFF | NcAsmInquiredType.NC_ON_OFF_AND_ASM_ON_OFF |
    NcAsmInquiredType.NC_MODE_SWITCH_AND_ASM_ON_OFF | NcAsmInquiredType.NC_ON_OFF_AND_ASM_SEAMLESS |
    NcAsmInquiredType.NC_MODE_SWITCH_AND_ASM_SEAMLESS | NcAsmInquiredType.MODE_NC_ASM_AUTO_NC_MODE_SWITCH_AND_ASM_SEAMLESS |
    NcAsmInquiredType.MODE_NC_ASM_DUAL_SINGLE_NC_MODE_SWITCH_AND_ASM_SEAMLESS |
    NcAsmInquiredType.MODE_NC_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS |
    NcAsmInquiredType.MODE_NC_NCSS_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS |
    NcAsmInquiredType.MODE_NC_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS_NA | NcAsmInquiredType.ASM_ON_OFF |
    NcAsmInquiredType.ASM_SEAMLESS | NcAsmInquiredType.NC_AMB_TOGGLE;

export class NcAsmStatusEnabled extends BasicCommand {
    public static fromBuffer(inquiredType: SupportedInquiredType, reader: ReadBuffer): NcAsmStatusEnabled {
        return new NcAsmStatusEnabled(
            inquiredType,
            SonyBool.fromReader(reader)
        );
    }

    constructor(
        public type: SupportedInquiredType,
        public enabled: boolean
    ) {
        super();
    }

    public getData() {
        return {
            enabled: this.enabled
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        SonyBool.toWriter(writer, this.enabled);

        return writer.toBuffer();
    }
}