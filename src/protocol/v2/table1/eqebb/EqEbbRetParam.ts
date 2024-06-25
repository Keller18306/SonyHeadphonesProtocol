import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { EqEbbInquiredType } from "./enum/EqEbbInquiredType";
import { EqEbbParamEbb, EqEbbParamPayload, EqEbbParamPresetEq, EqEbbParamPresetEqAndUlt } from "./param";

export class EqEbbRetParam extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.EQEBB_RET_PARAM;

    public static fromBuffer(buffer: Buffer): EqEbbRetParam {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.EQEBB_RET_PARAM) {
            throw new Error('Invalid data');
        }

        const inquiredType: EqEbbInquiredType = reader.readUInt8();

        switch (inquiredType) {
            case EqEbbInquiredType.EBB:
                return new EqEbbRetParam(EqEbbParamEbb.fromBuffer(reader));
            case EqEbbInquiredType.PRESET_EQ:
            case EqEbbInquiredType.PRESET_EQ_NONCUSTOMIZABLE:
                return new EqEbbRetParam(EqEbbParamPresetEq.fromBuffer(inquiredType, reader));
            case EqEbbInquiredType.PRESET_EQ_AND_ULT_MODE:
                return new EqEbbRetParam(EqEbbParamPresetEqAndUlt.fromBuffer(reader));
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