import { FrameDataType } from "./frame";

export class RawMessage {
    constructor(
        public readonly dataType: FrameDataType,
        public readonly payload: Buffer
    ) { }
}