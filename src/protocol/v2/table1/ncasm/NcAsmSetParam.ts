import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { NcAsmInquiredType } from "./enum/NcAsmInquiredType";
import {
    NcAsmParamPayload, NcAsmSetParamAsmSeamless, NcAsmSetParamModeAutoNcSwitchAndAsmSeamless,
    NcAsmSetParamModeDualNcSwitchAndAsmSeamless, NcAsmSetParamModeDualNcSwitchAndAsmSeamlessNa,
    NcAsmSetParamModeNcssDualNcSwitchAndAsmSeamless, NcAsmSetParamNcAmbToggle, NcAsmSetParamNcOnOff,
    NcAsmSetParamNcSwitchAndAsmOnOff, NcAsmSetParamNcSwitchAndAsmSeamless
} from "./param";

export class NcAsmSetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.NCASM_SET_PARAM;

    public static fromBuffer(buffer: Buffer): NcAsmSetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.NCASM_SET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: NcAsmInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case NcAsmInquiredType.NC_ON_OFF:
                return new NcAsmSetParam(NcAsmSetParamNcOnOff.fromBuffer(reader));
            case NcAsmInquiredType.NC_MODE_SWITCH_AND_ASM_ON_OFF:
                return new NcAsmSetParam(NcAsmSetParamNcSwitchAndAsmOnOff.fromBuffer(reader));
            case NcAsmInquiredType.NC_ON_OFF_AND_ASM_SEAMLESS:
                return new NcAsmSetParam(NcAsmSetParamNcSwitchAndAsmSeamless.fromBuffer(reader));
            case NcAsmInquiredType.NC_MODE_SWITCH_AND_ASM_SEAMLESS:
                return new NcAsmSetParam(NcAsmSetParamNcSwitchAndAsmSeamless.fromBuffer(reader));
            case NcAsmInquiredType.MODE_NC_ASM_AUTO_NC_MODE_SWITCH_AND_ASM_SEAMLESS:
            case NcAsmInquiredType.MODE_NC_ASM_DUAL_SINGLE_NC_MODE_SWITCH_AND_ASM_SEAMLESS:
                return new NcAsmSetParam(NcAsmSetParamModeAutoNcSwitchAndAsmSeamless.fromBuffer(inquiredType, reader));
            case NcAsmInquiredType.MODE_NC_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS:
                return new NcAsmSetParam(NcAsmSetParamModeDualNcSwitchAndAsmSeamless.fromBuffer(reader));
            case NcAsmInquiredType.MODE_NC_NCSS_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS:
                return new NcAsmSetParam(NcAsmSetParamModeNcssDualNcSwitchAndAsmSeamless.fromBuffer(reader));
            case NcAsmInquiredType.MODE_NC_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS_NA:
                return new NcAsmSetParam(NcAsmSetParamModeDualNcSwitchAndAsmSeamlessNa.fromBuffer(reader));
            case NcAsmInquiredType.ASM_SEAMLESS:
                return new NcAsmSetParam(NcAsmSetParamAsmSeamless.fromBuffer(reader));
            case NcAsmInquiredType.NC_AMB_TOGGLE:
                return new NcAsmSetParam(NcAsmSetParamNcAmbToggle.fromBuffer(reader));
        }

        throw new Error('Invalid inquiredType');
    }

    constructor(public payload: NcAsmParamPayload) {
        super();

        assertEnumValue(NcAsmInquiredType, payload.type);
    }

    public getData() {
        return {
            inquiredType: NcAsmInquiredType[this.payload.type],
            payload: this.payload.getData()
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.payload.type);
        writer.writeBuffer(this.payload.toBuffer());

        return writer.toBuffer();
    }
}