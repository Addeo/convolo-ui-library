import { Pipe, PipeTransform } from '@angular/core';

import { Mask } from '../mask/mask.class';
import { DateParserFormatter } from './date-parser-formatter.class';

// Formatting DateTime by pattern todo delete?
@Pipe({
    name: 'cnvDateFormatter',
    pure: true,
})
export class DateFormatterPipe implements PipeTransform {
    constructor() {}

    public transform(date: any, pattern: string): string {
        const mask: Mask = new Mask();
        mask.pattern = pattern;

        return DateParserFormatter.format(date, mask);
    }
}
