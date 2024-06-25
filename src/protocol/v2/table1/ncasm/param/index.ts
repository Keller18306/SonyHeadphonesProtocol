import { NcAsmSetParamAsmSeamless } from "./AsmSeamless";
import { NcAsmSetParamModeAutoNcSwitchAndAsmSeamless } from "./ModeAutoNcSwitchAndAsmSeamless";
import { NcAsmSetParamModeDualNcSwitchAndAsmSeamless } from "./ModeDualNcSwitchAndAsmSeamless";
import { NcAsmSetParamModeDualNcSwitchAndAsmSeamlessNa } from "./ModeDualNcSwitchAndAsmSeamlessNa";
import { NcAsmSetParamModeNcssDualNcSwitchAndAsmSeamless } from "./ModeNcssDualNcSwitchAndAsmSeamless";
import { NcAsmSetParamNcAmbToggle } from "./NcAmbToggle";
import { NcAsmSetParamNcOnOff } from "./NcOnOff";
import { NcAsmSetParamNcSwitchAndAsmSeamless } from "./NcOnOffAndAsmSeamless";
import { NcAsmSetParamNcSwitchAndAsmOnOff } from "./NcSwitchAndAsmOnOff";

export * from './AsmSeamless';
export * from './ModeAutoNcSwitchAndAsmSeamless';
export * from './ModeDualNcSwitchAndAsmSeamless';
export * from './ModeDualNcSwitchAndAsmSeamlessNa';
export * from './ModeNcssDualNcSwitchAndAsmSeamless';
export * from './NcAmbToggle';
export * from './NcOnOff';
export * from './NcOnOffAndAsmSeamless';
export * from './NcSwitchAndAsmOnOff';

export type NcAsmParamPayload = NcAsmSetParamNcOnOff | NcAsmSetParamNcSwitchAndAsmOnOff | NcAsmSetParamNcSwitchAndAsmSeamless |
    NcAsmSetParamModeAutoNcSwitchAndAsmSeamless | NcAsmSetParamModeDualNcSwitchAndAsmSeamless |
    NcAsmSetParamModeNcssDualNcSwitchAndAsmSeamless | NcAsmSetParamModeDualNcSwitchAndAsmSeamlessNa | NcAsmSetParamAsmSeamless | NcAsmSetParamNcAmbToggle;