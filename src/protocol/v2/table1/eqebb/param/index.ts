import { EqEbbParamEbb } from './Ebb';
import { EqEbbParamPresetEq } from './PresetEq';
import { EqEbbParamPresetEqAndUlt } from './PresetEqAndUlt';

export * from './Ebb';
export * from './PresetEq';
export * from './PresetEqAndUlt';

export type EqEbbParamPayload = EqEbbParamEbb | EqEbbParamPresetEq | EqEbbParamPresetEqAndUlt;