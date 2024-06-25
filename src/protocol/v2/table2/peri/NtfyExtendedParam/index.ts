import { PeriNtfyExtendedParamAction } from './Action';
import { PeriNtfyExtendedParamSourceSwitch } from './SourceSwitch';

export * from './Action';
export * from './SourceSwitch';

export type PeriNtfyExtendedParamPayload = PeriNtfyExtendedParamAction | PeriNtfyExtendedParamSourceSwitch;