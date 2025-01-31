import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { DeviceInfoType, ModelColor, ModelSeries } from "../enum";

export class ConnectInfoModel extends BasicCommand {
    public type: DeviceInfoType.SERIES_AND_COLOR_INFO = DeviceInfoType.SERIES_AND_COLOR_INFO;

    public static fromBuffer(reader: ReadBuffer): ConnectInfoModel {
        return new ConnectInfoModel(
            reader.readUInt8(),
            reader.readUInt8()
        );
    }

    constructor(
        public series: ModelSeries,
        public color: ModelColor
    ) {
        super();

        assertEnumValue(ModelSeries, series);
        assertEnumValue(ModelColor, color);

        if (color === ModelColor.DEFAULT) {
            throw new Error('Invalid color');
        }
    }

    public getData() {
        return {
            series: ModelSeries[this.series],
            color: ModelColor[this.color]
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.series);
        writer.writeUInt8(this.color);

        return writer.toBuffer();
    }
}