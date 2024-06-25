import { AudioParamBgm } from './Bgm';
import { AudioParamConnectionMode } from './ConnectionMode';
import { AudioParamUpscaling } from './Upscaling';

export * from './Bgm';
export * from './ConnectionMode';
export * from './Upscaling';

export type AudioParamPayload = AudioParamConnectionMode | AudioParamUpscaling | AudioParamBgm;