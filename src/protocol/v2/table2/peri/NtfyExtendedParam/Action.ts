import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { ConnectivityActionType } from "../enum/ConnectivityActionType";
import { PeripheralInquiredType } from "../enum/PeripheralInquiredType";
import { PeripheralResult } from "../enum/PeripheralResult";

type ParamInquiredType = PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_CLASSIC_BT | PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_WITH_BLUETOOTH_CLASS_OF_DEVICE_CLASSIC_BT;

export class PeriNtfyExtendedParamAction extends BasicCommand {
    public static fromBuffer(inquiredType: ParamInquiredType, reader: ReadBuffer): PeriNtfyExtendedParamAction {
        return new PeriNtfyExtendedParamAction(
            inquiredType,
            reader.readUInt8(),
            reader.readUInt8(),
            reader.readString(17, 'utf8')
        );
    }

    constructor(
        public type: ParamInquiredType,
        public actionType: ConnectivityActionType,
        public result: PeripheralResult,
        public address: string
    ) {
        super();

        assertEnumValue(PeripheralResult, result);
    }

    public getData() {
        return {
            action: ConnectivityActionType[this.actionType],
            result: PeripheralResult[this.result],
            address: this.address
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.actionType);
        writer.writeUInt8(this.result);
        writer.writeString(this.address, 'utf8');

        return writer.toBuffer();
    }
}