import { FrameDataType } from "../frame";
import { AbstractCommand } from "./abstract";
import { CommandTable1 } from "./table1";
import { table1list } from "./table1/list";
import { CommandTable2 } from "./table2";
import { table2list } from "./table2/list";

export class Command {
    public static getCommandName(dataType: FrameDataType, payload: Buffer): string | undefined {
        const byte = payload[0];

        if ([FrameDataType.DATA_MDR, FrameDataType.SHOT_MDR].includes(dataType)) {
            return CommandTable1[byte];
        }

        if ([FrameDataType.DATA_MDR_NO2, FrameDataType.SHOT_MDR_NO2].includes(dataType)) {
            return CommandTable2[byte];
        }
    }

    public static getCommand(dataType: FrameDataType, payload: Buffer): AbstractCommand | undefined {
        const byte = payload[0];

        let command: typeof AbstractCommand | undefined;
        if ([FrameDataType.DATA_MDR, FrameDataType.SHOT_MDR].includes(dataType)) {
            command = table1list[byte as CommandTable1];
        }

        if ([FrameDataType.DATA_MDR_NO2, FrameDataType.SHOT_MDR_NO2].includes(dataType)) {
            command = table2list[byte as CommandTable2];
        }

        if (command) {
            return command.fromBuffer(payload);
        }
    }
}

