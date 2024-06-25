export function intToHexStr(num: number): string {
    return '0x' + num.toString(16).toUpperCase();
}
