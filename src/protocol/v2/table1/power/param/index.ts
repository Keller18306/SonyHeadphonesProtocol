import { PowerParamAutoPowerOff } from "./AutoPowerOff";
import { PowerParamAutoPowerOffWearingDetection } from "./AutoPowerOffWearingDetection";
import { PowerParamBatterySafeMode } from "./BatterySafeMode";
import { PowerParamEnabled } from "./Enabled";

export type PowerParamPayload = PowerParamAutoPowerOff | PowerParamAutoPowerOffWearingDetection | PowerParamEnabled | PowerParamBatterySafeMode;

export * from './AutoPowerOff';
export * from './AutoPowerOffWearingDetection';
export * from './BatterySafeMode';
export * from './Enabled';