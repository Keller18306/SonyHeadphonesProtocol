import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { NcAsmInquiredType } from "./enum/NcAsmInquiredType";
import { NcAsmStatusEnabled, NcAsmStatusPayload, NcAsmStatusTestMode } from "./status";

export class NcAsmRetStatus extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.NCASM_RET_STATUS;

    public static fromBuffer(buffer: Buffer): NcAsmRetStatus {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.NCASM_RET_STATUS) {
            throw new Error('Invalid data');
        }

        const inquiredType: NcAsmInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case NcAsmInquiredType.NC_ON_OFF:
            case NcAsmInquiredType.NC_ON_OFF_AND_ASM_ON_OFF:
            case NcAsmInquiredType.NC_MODE_SWITCH_AND_ASM_ON_OFF:
            case NcAsmInquiredType.NC_ON_OFF_AND_ASM_SEAMLESS:
            case NcAsmInquiredType.NC_MODE_SWITCH_AND_ASM_SEAMLESS:
            case NcAsmInquiredType.MODE_NC_ASM_AUTO_NC_MODE_SWITCH_AND_ASM_SEAMLESS:
            case NcAsmInquiredType.MODE_NC_ASM_DUAL_SINGLE_NC_MODE_SWITCH_AND_ASM_SEAMLESS:
            case NcAsmInquiredType.MODE_NC_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS:
            case NcAsmInquiredType.MODE_NC_NCSS_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS:
            case NcAsmInquiredType.MODE_NC_ASM_DUAL_NC_MODE_SWITCH_AND_ASM_SEAMLESS_NA:
            case NcAsmInquiredType.ASM_ON_OFF:
            case NcAsmInquiredType.ASM_SEAMLESS:
            case NcAsmInquiredType.NC_AMB_TOGGLE:
                return new NcAsmRetStatus(NcAsmStatusEnabled.fromBuffer(inquiredType, reader));
            case NcAsmInquiredType.NC_TEST_MODE:
                return new NcAsmRetStatus(NcAsmStatusTestMode.fromBuffer(reader));
        }

        throw new Error('Invalid inquiredType');
    }

    constructor(public payload: NcAsmStatusPayload) {
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