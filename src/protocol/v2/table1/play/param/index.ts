import { PlayParamPlayback } from './Playback';
import { PlayParamVolume } from './Volume';
import { PlayParamVolumeWithMute } from './VolumeWithMute';

export * from './Playback';
export * from './Volume';
export * from './VolumeWithMute';

export type PlayParamPayload = PlayParamPlayback | PlayParamVolume | PlayParamVolumeWithMute;