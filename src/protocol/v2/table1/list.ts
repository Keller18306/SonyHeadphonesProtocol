import { AbstractCommand } from "../abstract";
import { AudioGetParam, AudioGetStatus, AudioNtfyParam, AudioRetParam, AudioRetStatus, AudioSetParam } from "./audio";
import { ConnectGetCapabilityInfo, ConnectGetProtocolInfo, ConnectRetCapabilityInfo, ConnectRetProtocolInfo } from "./connect";
import { EqEbbGetExtendedInfo, EqEbbGetParam, EqEbbGetStatus, EqEbbNtfyParam, EqEbbRetExtendedInfo, EqEbbRetParam, EqEbbRetStatus, EqEbbSetParam } from "./eqebb";
import { LeaNtfyStatus } from "./lea";
import { LogNtfyParam } from "./log";
import { NcAsmGetParam, NcAsmGetStatus, NcAsmNtfyParam, NcAsmRetParam, NcAsmRetStatus, NcAsmSetParam } from "./ncasm";
import { PlayGetParam, PlayGetStatus, PlayNtfyParam, PlayNtfyStatus, PlayRetParam, PlayRetStatus, PlaySetStatus } from "./play";
import { PowerGetParam, PowerGetStatus, PowerNtfyParam, PowerNtfyStatus, PowerRetParam, PowerRetStatus, PowerSetParam } from "./power";
import { CommandTable1 as Table } from "./table";
import { UpdtGetCapability, UpdtRetCapability } from "./update";

export const table1list: Partial<Record<Table, typeof AbstractCommand>> = {
    [Table.CONNECT_GET_PROTOCOL_INFO]: ConnectGetProtocolInfo,
    [Table.CONNECT_RET_PROTOCOL_INFO]: ConnectRetProtocolInfo,
    [Table.CONNECT_GET_CAPABILITY_INFO]: ConnectGetCapabilityInfo,
    [Table.CONNECT_RET_CAPABILITY_INFO]: ConnectRetCapabilityInfo,

    [Table.POWER_GET_STATUS]: PowerGetStatus,
    [Table.POWER_RET_STATUS]: PowerRetStatus,
    [Table.POWER_NTFY_STATUS]: PowerNtfyStatus,
    [Table.POWER_GET_PARAM]: PowerGetParam,
    [Table.POWER_RET_PARAM]: PowerRetParam,
    [Table.POWER_SET_PARAM]: PowerSetParam,
    [Table.POWER_NTFY_PARAM]: PowerNtfyParam,

    [Table.UPDT_GET_CAPABILITY]: UpdtGetCapability,
    [Table.UPDT_RET_CAPABILITY]: UpdtRetCapability,

    [Table.LEA_NTFY_STATUS]: LeaNtfyStatus,

    [Table.EQEBB_GET_STATUS]: EqEbbGetStatus,
    [Table.EQEBB_RET_STATUS]: EqEbbRetStatus,
    [Table.EQEBB_GET_PARAM]: EqEbbGetParam,
    [Table.EQEBB_RET_PARAM]: EqEbbRetParam,
    [Table.EQEBB_SET_PARAM]: EqEbbSetParam,
    [Table.EQEBB_NTFY_PARAM]: EqEbbNtfyParam,
    [Table.EQEBB_GET_EXTENDED_INFO]: EqEbbGetExtendedInfo,
    [Table.EQEBB_RET_EXTENDED_INFO]: EqEbbRetExtendedInfo,

    [Table.NCASM_GET_STATUS]: NcAsmGetStatus,
    [Table.NCASM_RET_STATUS]: NcAsmRetStatus,
    [Table.NCASM_GET_PARAM]: NcAsmGetParam,
    [Table.NCASM_RET_PARAM]: NcAsmRetParam,
    [Table.NCASM_SET_PARAM]: NcAsmSetParam,
    [Table.NCASM_NTFY_PARAM]: NcAsmNtfyParam,

    [Table.PLAY_GET_STATUS]: PlayGetStatus,
    [Table.PLAY_RET_STATUS]: PlayRetStatus,
    [Table.PLAY_SET_STATUS]: PlaySetStatus,
    [Table.PLAY_NTFY_STATUS]: PlayNtfyStatus,
    [Table.PLAY_GET_PARAM]: PlayGetParam,
    [Table.PLAY_RET_PARAM]: PlayRetParam,
    [Table.PLAY_NTFY_PARAM]: PlayNtfyParam,

    [Table.LOG_NTFY_PARAM]: LogNtfyParam,

    [Table.AUDIO_GET_STATUS]: AudioGetStatus,
    [Table.AUDIO_RET_STATUS]: AudioRetStatus,
    [Table.AUDIO_GET_PARAM]: AudioGetParam,
    [Table.AUDIO_RET_PARAM]: AudioRetParam,
    [Table.AUDIO_SET_PARAM]: AudioSetParam,
    [Table.AUDIO_NTFY_PARAM]: AudioNtfyParam,
}