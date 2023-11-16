import { MaskSection } from '../mask/mask-section.class';
import { Mask } from '../mask/mask.class';

// Parse and format DateTime
export class DateParserFormatter {
    // Creating Invalid Date
    public static invalidDate(): Date {
        return new Date('*');
    }

    public static daysInMonth(year: number, month: number): number {
        return new Date(year, month, 0).getDate();
    }

    public static parse(value: string, mask: Mask, minY: number = 1950, maxY: number = 2050): any {
        if (value === '') {
            return null;
        }

        let sectionPos = 0;
        const res = value;

        let d = 1;
        let m = 1;
        let y = 1970;

        let hh = 0;
        let mi = 0;
        let ss = 0;
        let ms = 0;

        let tt = '';

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < mask.sections.length; i++) {
            const section: MaskSection = mask.sections[i]!;
            const datePart = section.sectionType?.datePart;

            if (!datePart) {
                // Not datetime component
                continue;
            }

            const v = section.extract(res, sectionPos);
            sectionPos = v.nextSectionPos();

            // Get section value
            const s = v.section.value();

            let n: number;
            n = NaN;

            if (section.isNumeric()) {
                if (s.includes(mask.settings.placeholder)) {
                    // Contains placeholders
                    return DateParserFormatter.invalidDate();
                }

                n = section.numericValue(section.removePlaceholders(s));

                // @ts-expect-error
                if (n < section.sectionType.min || n > section.sectionType.max) {
                    return DateParserFormatter.invalidDate();
                }
            } else {
                if (section.hasOptions()) {
                    // @ts-expect-error
                    n = section.sectionType.options.indexOf(s);
                    if (n < 0) {
                        return DateParserFormatter.invalidDate();
                    }
                    // eslint-disable-next-line no-plusplus
                    n++; // Index starts from 0
                }
            }

            if (Number.isNaN(n)) {
                return DateParserFormatter.invalidDate();
            }

            // Time components
            if (datePart === 'H') {
                hh = n;
            }

            if (datePart === 'h') {
                hh = n;
                if (hh === 12) {
                    hh = 0;
                }
            }

            if (datePart === 'tt') {
                tt = s;
            }

            if (datePart === 'mi') {
                mi = n;
            }

            if (datePart === 'ss') {
                ss = n;
            }

            if (datePart === 'ms') {
                ms = n;
            }

            // Date components
            if (datePart === 'd') {
                d = n;
            }

            if (datePart === 'm') {
                m = n;
            }

            if (datePart === 'yy') {
                y = n < 50 ? 2000 + n : 1900 + n;
            }

            if (datePart === 'yyyy') {
                y = n;
            }
        }

        if (tt.toLowerCase() === 'pm') {
            hh += 12;
        }

        // We should check number of days in month
        const maxDays: number = DateParserFormatter.daysInMonth(y, m);
        if (d > maxDays) {
            return DateParserFormatter.invalidDate();
        }

        const result = new Date(y, m - 1, d, hh, mi, ss, ms);
        result.setFullYear(y);
        return result;
    }

    public static format(date: any, mask: Mask): string {
        if (date === null || date === undefined || Number.isNaN(date.getTime())) {
            return '';
        }

        let res = '';
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < mask.sections.length; i++) {
            const section: MaskSection = mask.sections[i]!;
            const datePart = section.sectionType?.datePart;

            let n = NaN;

            if (datePart === 'yyyy') {
                n = date.getFullYear();
            }

            if (datePart === 'yy') {
                n = date.getFullYear();
                if (n >= 2000) {
                    n -= 2000;
                } else {
                    n -= 1900;
                }
            }

            if (datePart === 'm') {
                n = date.getMonth() + 1;
            }

            if (datePart === 'd') {
                n = date.getDate();
            }

            if (datePart === 'H') {
                n = date.getHours();
            }

            if (datePart === 'h') {
                n = date.getHours();

                if (n === 0) {
                    n = 12;
                } else {
                    if (n > 12) {
                        n -= 12;
                    }
                }
            }

            if (datePart === 'mi') {
                n = date.getMinutes();
            }

            if (datePart === 'ss') {
                n = date.getSeconds();
            }

            if (datePart === 'ms') {
                n = date.getMilliseconds();
            }

            if (datePart === 'tt') {
                n = date.getHours() >= 12 ? 2 : 1;
            }

            let s = '';

            if (section.hasOptions()) {
                s = section.sectionType?.options![n - 1]!;
            } else {
                s = section.autoCorrectVal(`${n}`);
            }

            res += s + section.delimiter;
        }

        return res;
    }
}
