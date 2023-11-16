import { MaskSectionType } from './mask-section-type.class';

export class MaskSettings {
    // Autocorrection of section's value. If value entered is bigger than
    // Maximum - replaced with maxValue, if less than minimum - with minValue.
    public autoCorrect = true;

    // On start of input placeholders are added automatically
    public appendPlaceholders = false;

    // Allow values, for which input had not been completed (placeholders are present or length doesn't comply to a mask)
    public allowIncomplete = true;

    // ArrowUp and ArrowDown keys change values to previous and next
    public incDecByArrows = false;

    // If set to true, moving to an incomplete section with predefined set of values,
    // first value of the set will be entered automatically
    public defaultOptions = true;

    // New type of section can be added
    public sectionTypes: Array<MaskSectionType> = [];

    constructor(
        public placeholder: string, // Placeholder char
        public replaceMode: boolean = false, // Replace mode - on carriage position change // current char is selected
    ) {}
}
