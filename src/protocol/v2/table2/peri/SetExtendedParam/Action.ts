import { ReadBuffer, WriteBuffer } from "../../../../../utils/buffer";
import { assertEnumValue } from "../../../../../utils/enum";
import { BasicCommand } from "../../../basic";
import { ConnectivityActionType } from "../enum/ConnectivityActionType";
import { PeripheralInquiredType } from "../enum/PeripheralInquiredType";

type ParamInquiredType = PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_CLASSIC_BT | PeripheralInquiredType.PAIRING_DEVICE_MANAGEMENT_WITH_BLUETOOTH_CLASS_OF_DEVICE_CLASSIC_BT;

export class PeriSetExtendedParamAction extends BasicCommand {
    public static fromBuffer(inquiredType: ParamInquiredType, reader: ReadBuffer): PeriSetExtendedParamAction {
        return new PeriSetExtendedParamAction(
            inquiredType,
            reader.readUInt8(),
            reader.readString(17, 'utf8')
        );
    }

    constructor(
        public type: ParamInquiredType,
        public actionType: ConnectivityActionType,
        public address: string
    ) {
        super();

        assertEnumValue(ConnectivityActionType, actionType);
    }

    public getData() {
        return {
            action: ConnectivityActionType[this.actionType],
            address: this.address
        }
    }

    public toBuffer(): Buffer {
        const writer = new WriteBuffer();

        writer.writeUInt8(this.actionType);
        writer.writeString(this.address, 'utf8');

        return writer.toBuffer();
    }
}