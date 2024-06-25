import { AbstractCommand } from "../abstract";
import { PeriGetParam, PeriGetStatus, PeriNtfyExtendedParam, PeriNtfyParam, PeriRetParam, PeriRetStatus, PeriSetExtendedParam, PeriSetParam } from "./peri";
import { CommandTable2 as Table } from "./table";
import { VoiceGuidanceGetExtendedParam, VoiceGuidanceRetExtendedParam } from "./voiceguidance";

export const table2list: Partial<Record<Table, typeof AbstractCommand>> = {
    [Table.PERI_GET_STATUS]: PeriGetStatus,
    [Table.PERI_RET_STATUS]: PeriRetStatus,
    [Table.PERI_GET_PARAM]: PeriGetParam,
    [Table.PERI_RET_PARAM]: PeriRetParam,
    [Table.PERI_SET_PARAM]: PeriSetParam,
    [Table.PERI_NTFY_PARAM]: PeriNtfyParam,
    [Table.PERI_SET_EXTENDED_PARAM]: PeriSetExtendedParam,
    [Table.PERI_NTFY_EXTENDED_PARAM]: PeriNtfyExtendedParam,

    [Table.VOICE_GUIDANCE_GET_EXTENDED_PARAM]: VoiceGuidanceGetExtendedParam,
    [Table.VOICE_GUIDANCE_RET_EXTENDED_PARAM]: VoiceGuidanceRetExtendedParam
}