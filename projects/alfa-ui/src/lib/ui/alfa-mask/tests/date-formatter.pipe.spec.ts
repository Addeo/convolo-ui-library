import { DateFormatterPipe } from '../dates/date-formatter.pipe';
import { InternationalizationService } from '$services/internationalization/internationalization.service';

describe('Format datetime by Mask (mask=MM/dd/yy h:mi tt, value=01/05/19 2:30 pm)', () => {
    const intl = new InternationalizationService();

    const date = new Date(2019, 0, 5, 14, 30, 0);

    const formatter = new DateFormatterPipe(intl);
    const pattern = 'MM/dd/yy h:mi tt';
    const res = formatter.transform(date, pattern);

    it('Formatted value = 01/05/2019 2:30 pm', () => expect(res).toBe('01/05/19 2:30 pm'));
});

describe('Format datetime by Mask (mask = dd.MM.yyyy HH:mi:ss.fff, value = 01/05/2019 13:30:15.152)', () => {
    const intl = new InternationalizationService();

    const date = new Date(2019, 0, 5, 13, 30, 15, 152);

    const formatter = new DateFormatterPipe(intl);
    const pattern = 'dd.MM.yyyy HH:mi:ss.fff';
    const res = formatter.transform(date, pattern);

    it('Formatted value = 05.01.2019 13:30:15.152', () =>
        expect(res).toBe('05.01.2019 13:30:15.152'));
});
