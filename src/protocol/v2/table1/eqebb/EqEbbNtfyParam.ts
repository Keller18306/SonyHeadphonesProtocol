import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { EqEbbInquiredType } from "./enum/EqEbbInquiredType";
import { EqEbbParamEbb, EqEbbParamPayload, EqEbbParamPresetEq, EqEbbParamPresetEqAndUlt } from "./param";

export class EqEbbNtfyParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.EQEBB_NTFY_PARAM;

    public static fromBuffer(buffer: Buffer): EqEbbNtfyParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.EQEBB_NTFY_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: EqEbbInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case EqEbbInquiredType.EBB:
                return new EqEbbNtfyParam(EqEbbParamEbb.fromBuffer(reader));
            case EqEbbInquiredType.PRESET_EQ:
            case EqEbbInquiredType.PRESET_EQ_NONCUSTOMIZABLE:
                return new EqEbbNtfyParam(EqEbbParamPresetEq.fromBuffer(inquiredType, reader));
            case EqEbbInquiredType.PRESET_EQ_AND_ULT_MODE:
                return new EqEbbNtfyParam(EqEbbParamPresetEqAndUlt.fromBuffer(reader));
        }

        throw new Error('Invalid inquiredType');
    }

    constructor(public payload: EqEbbParamPayload) {
        super();

        assertEnumValue(EqEbbInquiredType, payload.type);
    }

    public getData() {
        return {
            inquiredType: EqEbbInquiredType[this.payload.type],
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