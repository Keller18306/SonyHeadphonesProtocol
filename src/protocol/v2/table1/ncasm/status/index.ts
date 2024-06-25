import { NcAsmStatusEnabled } from "./Enabled";
import { NcAsmStatusTestMode } from "./TestMode";

export * from './Enabled';
export * from './TestMode';

export type NcAsmStatusPayload = NcAsmStatusEnabled | NcAsmStatusTestMode;