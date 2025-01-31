import { Api } from "./src/api";
import { BluetoothWebConnector } from "./src/connector/web";
import { ProtocolController, sonyProtocolV2_UUID } from "./src/protocol";

(window as any).test = async () => {
    const connector = await BluetoothWebConnector.requestPort();
    const controller = new ProtocolController(connector);
    const api = new Api(controller);

    await connector.open();
    console.log('Connected');

    (window as any).connector = connector;
    (window as any).controller = controller;
    (window as any).api = api;

    const a = await api.getDeviceSeriesAndColor()
    console.log(a);
}