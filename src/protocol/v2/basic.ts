export abstract class BasicCommand {
    public static fromBuffer(...args: any): BasicCommand {
        throw new Error('BasicCommand not implemented');
    }

    public abstract toBuffer(): Buffer;

    constructor(...args: any) { }

    public getData?(): any;
}
