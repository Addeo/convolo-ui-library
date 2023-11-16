import { DateParserPipe } from '../dates/date-parser.pipe';
import { InternationalizationService } from '$services/internationalization/internationalization.service';

describe('Parse datetime by Mask (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30 pm)', () => {
    const intl = new InternationalizationService();

    const dateString = '01/05/19 1:30 pm';

    const parser = new DateParserPipe(intl);
    const pattern = 'MM/dd/yy h:mi tt';
    const res = parser.transform(dateString, pattern); // MaskDate.parseDate(mask.sections, dateString);

    it('Month = 0', () => expect(res.getMonth()).toBe(0));
    it('Day = 5', () => expect(res.getDate()).toBe(5));
    it('Year = 2019', () => expect(res.getFullYear()).toBe(2019));
    it('Hours = 13', () => expect(res.getHours()).toBe(13));
    it('Minutes = 30', () => expect(res.getMinutes()).toBe(30));
});

describe('Parse datetime by Mask (mask=dd mmm yyyy, value=12 дек 2018)', () => {
    const intl = new InternationalizationService();

    const dateString = '12 дек 2018';

    const parser = new DateParserPipe(intl);
    const pattern = 'dd mmm yyyy';
    const res = parser.transform(dateString, pattern); // MaskDate.parseDate(mask.sections, dateString);

    it('Month = 11', () => expect(res.getMonth()).toBe(11));
    it('Day = 12', () => expect(res.getDate()).toBe(12));
    it('Year = 2018', () => expect(res.getFullYear()).toBe(2018));
});

describe('Parse not matched date (mask=MM/dd/yy h:mi tt, value=01/05/19 1:30)', () => {
    const intl = new InternationalizationService();

    const dateString = '01/05/19 1:30';

    const parser = new DateParserPipe(intl);
    const pattern = 'MM/dd/yy h:mi tt';
    const res = parser.transform(dateString, pattern); // MaskDate.parseDate(mask.sections, dateString);

    it('Result must be Invalid Date', () => expect(res.getTime()).toBeNaN());
});

describe('Parse invalid date (mask=MM/dd/yy, value=02/31/19)', () => {
    const intl = new InternationalizationService();

    const dateString = '02/31/19';

    const parser = new DateParserPipe(intl);
    const pattern = 'MM/dd/yy';
    const res = parser.transform(dateString, pattern); // MaskDate.parseDate(mask.sections, dateString);

    it('Result must be Invalid Date', () => expect(res.getTime()).toBeNaN());
});
