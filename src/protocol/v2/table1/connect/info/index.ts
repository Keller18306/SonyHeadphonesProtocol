import { ConnectInfoInstruction } from './Instruction';
import { ConnectInfoModel } from './Model';
import { ConnectInfoString } from './String';

export type ConnectInfoPayload = ConnectInfoModel | ConnectInfoString | ConnectInfoInstruction;

export * from './Instruction';
export * from './Model';
export * from './String';