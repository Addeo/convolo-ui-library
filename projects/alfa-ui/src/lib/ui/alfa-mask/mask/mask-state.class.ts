export class MaskState {
    public static EMPTY = new MaskState('EMPTY');
    public static TYPING = new MaskState('...');
    public static OK = new MaskState('OK');

    constructor(public name: string) {}
}
