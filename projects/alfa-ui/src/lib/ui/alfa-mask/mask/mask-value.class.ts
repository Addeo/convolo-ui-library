import { MaskSectionValue } from './mask-section-value.class';

// TODO: initial values
export class MaskValue {
    public inSection!: boolean;

    public sectionPos!: number;

    public before!: string;
    public section!: MaskSectionValue;
    public delimiter!: string;
    public after!: string;

    public nextSectionPos(): number {
        return this.before.length + this.section.length + this.delimiter.length;
    }

    public update(str: string, selStart: number): string {
        this.section = new MaskSectionValue(str, this.sectionPos, selStart);
        return this.value();
    }

    public value(): string {
        return this.before + this.section.value() + this.delimiter + this.after;
    }
}
