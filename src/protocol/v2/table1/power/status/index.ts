import { PowerStatusBattery } from "./Battery";
import { PowerStatusBatteryWithThreshold } from "./BatteryWithThreshold";
import { PowerStatusEnabled } from "./Enabled";
import { PowerStatusLeftRight } from "./LeftRight";
import { PowerStatusLRWithThreshold } from "./LRWithThreshold";

export type PowerStatusPayload = PowerStatusBattery | PowerStatusLeftRight |
    PowerStatusEnabled | PowerStatusBatteryWithThreshold | PowerStatusLRWithThreshold;

export * from './Battery';
export * from './BatteryWithThreshold';
export * from './Enabled';
export * from './LRWithThreshold';
export * from './LeftRight';