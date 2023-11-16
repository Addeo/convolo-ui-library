import { Pipe, PipeTransform } from '@angular/core';

import { Mask } from '../mask/mask.class';
import { DateParserFormatter } from './date-parser-formatter.class';

// todo delete
// Parsing DateTime by Mask
@Pipe({
    name: 'cnvDateParser',
    pure: false,
})
export class DateParserPipe implements PipeTransform {
    constructor() {}

    public transform(value: string, pattern: string): any {
        const mask: Mask = new Mask();
        mask.pattern = pattern;

        return DateParserFormatter.parse(value, mask);
    }
}
