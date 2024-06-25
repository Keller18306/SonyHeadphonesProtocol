import { PeriSetExtendedParamAction } from './Action';
import { PeriSetExtendedParamSourceSwitch } from './SourceSwitch';

export * from './Action';
export * from './SourceSwitch';

export type PeriSetExtendedParamPayload = PeriSetExtendedParamAction | PeriSetExtendedParamSourceSwitch;