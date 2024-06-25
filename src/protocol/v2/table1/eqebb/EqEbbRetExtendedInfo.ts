import { ReadBuffer, WriteBuffer } from "../../../../utils/buffer";
import { assertEnumValue } from "../../../../utils/enum";
import { FrameDataType } from "../../../frame";
import { AbstractCommand } from "../../abstract";
import { CommandTable1 } from "../table";
import { EqEbbInquiredType } from "./enum/EqEbbInquiredType";
import { BandInfo } from "./types/BandInfo";

export class EqEbbRetExtendedInfo extends AbstractCommand {
    public dataType: FrameDataType = FrameDataType.DATA_MDR;
    public command: CommandTable1 = CommandTable1.EQEBB_RET_EXTENDED_INFO;

    public static fromBuffer(buffer: Buffer): EqEbbRetExtendedInfo {
        const reader = new ReadBuffer(buffer);

        if (reader.readUInt8() !== CommandTable1.EQEBB_RET_EXTENDED_INFO) {
            throw new Error('Invalid data');
        }

        const inquiredType: EqEbbInquiredType = reader.readUInt8();

        if (![
            EqEbbInquiredType.PRESET_EQ,
            EqEbbInquiredType.PRESET_EQ_NONCUSTOMIZABLE,
            EqEbbInquiredType.PRESET_EQ_AND_ULT_MODE
        ].includes(inquiredType)) {
            throw new Error('Unsupported inquiredType')
        }

        const bandsInfo: BandInfo[] = [];

        const count = reader.readUInt8();
        for (let i = 0; i < count; i++) {
            const informationType = reader.readUInt8();
            const value = reader.readUInt16BE();

            bandsInfo.push(new BandInfo(informationType, value));
        }

        return new EqEbbRetExtendedInfo(inquiredType, bandsInfo);
    }

    constructor(public inquiredType: EqEbbInquiredType, public bandsInfo: BandInfo[]) {
        super();

        assertEnumValue(EqEbbInquiredType, inquiredType);

        if (![
            EqEbbInquiredType.PRESET_EQ,
            EqEbbInquiredType.PRESET_EQ_NONCUSTOMIZABLE,
            EqEbbInquiredType.PRESET_EQ_AND_ULT_MODE
        ].includes(inquiredType)) {
            throw new Error('Unsupported inquiredType')
        }
    }

    public getData() {
        return {
            inquiredType: EqEbbInquiredType[this.inquiredType],
            bandsInfo: this.bandsInfo.map(_ => _.getData())
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.command);
        writer.writeUInt8(this.inquiredType);

        writer.writeUInt8(this.bandsInfo.length);
        for (const band of this.bandsInfo) {
            writer.writeUInt8(band.informationType);
            writer.writeUInt16BE(band.value);
        }

        return writer.toBuffer();
    }
}