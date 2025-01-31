import { ConnectGetDeviceInfo, ConnectGetProtocolInfo, ConnectGetSupportFunctionTable1, ConnectGetSupportFunctionTable2, ConnectRetDeviceInfo, ConnectRetProtocolInfo, ConnectRetSupportFunctionTable1, ConnectRetSupportFunctionTable2, DeviceInfoType, ProtocolController } from "../protocol";

export class Api {
    constructor(private controller: ProtocolController) { }

    public async getDeviceFwVersion(): Promise<string> {
        return this.controller.invokeAndFilter((command) => {
            if (command instanceof ConnectRetDeviceInfo && command.payload.type === DeviceInfoType.FW_VERSION) {
                return command.payload.value;
            }
        }, new ConnectGetDeviceInfo(DeviceInfoType.FW_VERSION));
    }

    public getDeviceSeriesAndColor() {
        return this.controller.invokeAndFilter((command) => {
            if (command instanceof ConnectRetDeviceInfo && command.payload.type === DeviceInfoType.SERIES_AND_COLOR_INFO) {
                return command.payload;
            }
        }, new ConnectGetDeviceInfo(DeviceInfoType.SERIES_AND_COLOR_INFO));
    }

    public async getSupportedFunctions() {
        const [table1, table2] = await Promise.all([
            this.controller.invokeAndFilter((command) => {
                if (command instanceof ConnectRetSupportFunctionTable1) {
                    return command.functions.map((entry) => {
                        return entry.func;
                    });
                }
            }, new ConnectGetSupportFunctionTable1()),
            this.controller.invokeAndFilter((command) => {
                if (command instanceof ConnectRetSupportFunctionTable2) {
                    return command.functions.map((entry) => {
                        return entry.func;
                    });
                }
            }, new ConnectGetSupportFunctionTable2())
        ]);

        return { table1, table2 };
    }

    public async getProtocolInfo() {
        return this.controller.invokeAndFilter((command) => {
            if (command instanceof ConnectRetProtocolInfo) {
                return command;
            }
        }, new ConnectGetProtocolInfo());
    }
}