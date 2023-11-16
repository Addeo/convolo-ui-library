export class MaskSectionType {
    public selectors: Array<string> = [];
    public numeric = false;
    public min?: number | null = null;
    public max?: number | null = null;
    public options?: Array<string>;

    public regExp?: RegExp;

    // Can be useful if section is not integer
    public minL?: number | null = null;
    public maxL?: number | null = null;

    // Which part of the date is represented with this section
    //  d - day
    //  m - month
    //  y - year
    //  h - hour (0 - 12)
    //  H - hour (0 - 24)
    //  mi - minutes
    //  s - seconds
    //  ms - milliseconds
    public datePart?: string | null = null;
}
