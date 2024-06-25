import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { SystemFunction } from "../../system/enum/SystemFunction";
import { NcAsmInquiredType } from "../enum/NcAsmInquiredType";

export class NcAsmSetParamNcAmbToggle extends BasicCommand {
    public type: NcAsmInquiredType = NcAsmInquiredType.NC_AMB_TOGGLE;

    public static fromBuffer(reader: ReadBuffer): NcAsmSetParamNcAmbToggle {
        const sysFunc: SystemFunction = reader.readUInt8();

        return new NcAsmSetParamNcAmbToggle(sysFunc);
    }

    constructor(public sysFunc: SystemFunction) {
        super();

        assertEnumValue(SystemFunction, sysFunc);

        if (![
            SystemFunction.NC_ASM_OFF, SystemFunction.NC_ASM,
            SystemFunction.NC_OFF, SystemFunction.ASM_OFF
        ].includes(sysFunc)) {
            throw new Error('Unsupported function')
        }
    }

    public getData() {
        return {
            noiseCancel: SystemFunction[this.sysFunc]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.sysFunc);

        return writer.toBuffer();
    }
}