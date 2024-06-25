import { enumToString } from "../../utils/enum";
import { serializeObject } from "../../utils/object";
import { FrameDataType } from "../frame";
import { CommandTable1 } from "./table1/table";
import { CommandTable2 } from "./table2/table";

export abstract class AbstractCommand {
    public static fromBuffer(buffer: Buffer): AbstractCommand {
        throw new Error('Command not implemented');
    }

    public abstract dataType: FrameDataType;
    public abstract command: CommandTable1 | CommandTable2;
    public abstract toBuffer(): Buffer;

    constructor(...args: any) { }

    public getName(): string | null {
        if ([FrameDataType.DATA_MDR, FrameDataType.SHOT_MDR].includes(this.dataType)) {
            return CommandTable1[this.command] ?? null;
        } else if ([FrameDataType.DATA_MDR_NO2, FrameDataType.SHOT_MDR_NO2].includes(this.dataType)) {
            return CommandTable2[this.command] ?? null;
        }

        return null;
    }

    public getData?(): any;

    public toString(): string {
        const dataType = this.dataType;

        const info: string[] = [
            // `type:${enumToString(FrameDataType, dataType, '???')}(${intToHexStr(dataType)})`,
            `type:${enumToString(FrameDataType, dataType, '???')}`,

        ];

        info.push(`cmd:${this.getName() ?? '???'}`);

        if (this.getData) {
            const data = this.getData();

            info.push(`data:${serializeObject(data)}`);
        } else {
            const payload = this.toBuffer();
            if (payload.length > 0) {
                info.push(
                    `payload[${payload.length}]:${payload.toString('hex').toUpperCase().match(/..?/g)?.join(' ')}`
                );
            }
        }

        return `Command{${info.join(', ')}}`
    }
}

