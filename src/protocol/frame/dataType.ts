export enum FrameDataType {
    ACK = 1,
    DATA_MDR = 12,
    SHOT_MDR = 28,
    DATA_MDR_NO2 = 14,
    SHOT_MDR_NO2 = 30
}
 
export function isAckRequired(dataType: FrameDataType): boolean {
    return [FrameDataType.DATA_MDR, FrameDataType.DATA_MDR_NO2].includes(dataType);
}
