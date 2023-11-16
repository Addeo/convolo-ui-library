/* eslint-disable eqeqeq */
export class MaskSectionValue {
    public beforeChars: string;
    public currentChar: string;
    public afterChars: string;

    public append(s: string): void {
        this.afterChars += s;
    }

    public value(newChar: string | null = null): string {
        if (newChar != null) {
            return this.beforeChars + newChar + this.afterChars;
        }
        return this.beforeChars + this.currentChar + this.afterChars;
    }

    public get length(): number {
        return this.value().length;
    }

    constructor(sectionValue: string, sectionPos: number, selStart: number) {
        const selStartLocal = selStart - sectionPos;

        if (selStartLocal < 0 || selStartLocal > sectionValue.length) {
            this.beforeChars = sectionValue;
            this.currentChar = '';
            this.afterChars = '';
            return;
        }

        this.beforeChars = sectionValue.substring(0, selStartLocal);
        this.currentChar = sectionValue.substring(selStartLocal, selStartLocal + 1);
        this.afterChars = sectionValue.substring(selStartLocal + 1);
    }
}
