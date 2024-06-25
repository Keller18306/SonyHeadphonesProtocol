export class Checksum {
    public static calc(buffer: Buffer): number {
        let chk: number = 0;

        for (const byte of buffer) {
            chk = (chk + byte) & 0xff;
        }

        return chk;
    }
}