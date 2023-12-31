import { waitForAsync } from '@angular/core/testing';

import { InternationalizationService } from '$services/internationalization/internationalization.service';
import { Keys } from '../keys/keys.class';
import { Action, MaskSection } from '../mask/mask-section.class';
import { MaskSettings } from '../mask/mask-settings.class';
import { Mask } from '../mask/mask.class';

describe('MaskValue [dd.mm.yyyy] - split second section of "13.12.2018": ', () => {
    let maskValue: any;

    beforeEach(waitForAsync(() => {
        const intl = new InternationalizationService();
        const settings = new MaskSettings(' ');
        const m: Mask = new Mask(intl);
        const sType = m.selectSectionType('mm');

        const section = new MaskSection(intl, settings, 'mm', '.', sType);

        maskValue = section.extract('13.12.2018', 3, 4, 0);
    }));

    it('beforeValue should be equal "13."', () => expect(maskValue.before).toBe('13.'));
    it('sectionValue should be equal "12"', () => expect(maskValue.section.value()).toBe('12'));
    it('delimiter should be equal "."', () => expect(maskValue.delimiter).toBe('.'));
    it('afterValue should be equal "2018"', () => expect(maskValue.after).toBe('2018'));
    it('nextPos should be equal 6', () => expect(maskValue.nextSectionPos()).toBe(6));

    it('Начало секции перед курсором должно быть 1', () =>
        expect(maskValue.section.beforeChars).toBe('1'));
    it('Символ на позиции курсора должен быть 2', () =>
        expect(maskValue.section.currentChar).toBe('2'));
});

describe("MaskValue [mm/dd/yyyy] - apply key '3' with selStart=3 : ", () => {
    let res: any;

    beforeEach(waitForAsync(() => {
        const intl = new InternationalizationService();

        const mask = new Mask(intl);

        mask.pattern = 'mm/dd/yyyy';
        const section = mask.sections[1]!;
        res = section.applyKey('12/', 0, '3', 3, 3, 0);
    }));

    it('Новое значение маски должно быть 12/3', () => expect(res.newValue).toBe('12/3'));
    it('Новая позиция курсора должна быть 4', () => expect(res.selStart).toBe(4));
});

describe("MaskValue [mm/dd/yyyy] - apply key '/' with selStart=1: ", () => {
    let res: any;

    beforeEach(waitForAsync(() => {
        const intl = new InternationalizationService();
        const settings = new MaskSettings(' ');
        settings.appendPlaceholders = false;

        const mask = new Mask(intl);
        mask.pattern = 'mm/dd/yyyy';
        const section = mask.sections[1]!;
        res = section.applyKey('1', 0, '/', 0, 1, 0, true);
    }));

    it('Новое значение маски должно быть 01/', () => expect(res.newValue).toBe('01/'));
    it('Новая позиция курсора должна быть 3', () => expect(res.selStart).toBe(3));
});

describe('Автоматическое заполнение секции первым вариантом: ', () => {
    let res: any;

    beforeEach(waitForAsync(() => {
        const settings: MaskSettings = new MaskSettings('_', true);
        settings.appendPlaceholders = true;
        settings.defaultOptions = true;

        const intl = new InternationalizationService();
        const mask = new Mask(intl);
        mask.settings = settings;
        mask.pattern = 'dd mmm yyyy';
        const section = mask.sections[1]!;
        res = section.setDefaultVariant('13 ___ ____', 3);
    }));

    it('Новое значение маски должно быть 13 янв ____', () => expect(res).toBe('13 янв ____'));
});

describe("MaskValue [dd mmm yyyy] - apply key 'д' on value '13 ' with selStart=3 : ", () => {
    let res: any;

    beforeEach(waitForAsync(() => {
        const intl = new InternationalizationService();
        const mask = new Mask(intl);
        mask.pattern = 'dd mmm yyyy';
        const section = mask.sections[1]!;
        res = section.applyKey('13 ', 0, 'д', 3, 3, 0);
    }));

    it('Новое значение маски должно быть 13 дек', () => expect(res.newValue).toBe('13 дек'));
    it('Новая позиция курсора должна быть 4', () => expect(res.selStart).toBe(4));
});

describe("MaskValue [dd mmm yyyy] - apply key 'Delete' on 13 дек 1979  with selStart=10 : ", () => {
    let res: any;

    beforeEach(waitForAsync(() => {
        const intl = new InternationalizationService();
        const mask = new Mask(intl);
        mask.pattern = 'dd mmm yyyy';
        const section = mask.sections[2]!;
        res = section.applyKey('13 дек 1979', Keys.DELETE, '', 7, 10, 0);
    }));

    it('Новое значение маски должно быть 13 дек 197', () =>
        expect(res.newValue).toBe('13 дек 197'));
    it('Новая позиция курсора должна быть 10', () => expect(res.selStart).toBe(10));
});

describe('Section features', () => {
    const intl = new InternationalizationService();
    const mask = new Mask(intl);
    mask.settings = new MaskSettings('_', true);
    mask.pattern = 'dd mmm yyyy';
    const section = mask.sections[0]!;
    const monthSection = mask.sections[1]!;

    it('Autocorrect 99 янв 2019 -> 31 янв 2019', () => {
        expect(section.autoCorrect('99 янв 2019', 0, 0, 0).newValue).toBe('31 янв 2019');
    });

    it('Select last char of first section', () => {
        const res = section.selectLast('31 янв 2019', 0);
        expect(res.selStart).toBe(1);
        expect(res.selLength).toBe(1);
    });

    it('Set default month', () => {
        const res = monthSection.setDefaultVariant('31 ', 3);
        expect(res).toBe('31 янв');
    });

    it('Right arrow key', () => {
        const res2 = monthSection.applyKey('31 янв 2019', Keys.RIGHT, '', 3, 3, 1);
        expect(res2.selStart).toBe(4);
    });

    it('Right arrow key at the end of the section', () => {
        const res3 = monthSection.applyKey('31 янв 2019', Keys.RIGHT, '', 3, 5, 1);
        expect(res3.action).toBe(Action.GO_FWD);
    });

    it('Backspace key at the second char of the month', () => {
        const res3 = monthSection.applyKey('31 янв 2019', Keys.BACKSPACE, '', 3, 4, 1);
        expect(res3.newValue).toBe('31 _нв 2019');
    });

    it('Backspace key at the start of the month', () => {
        const res3 = monthSection.applyKey('31 янв 2019', Keys.BACKSPACE, '', 3, 3, 1);
        expect(res3.action).toBe(Action.GO_BACK_AND_DELETE);
    });

    it('Backspace key at the start of text', () => {
        const res3 = section.applyKey('31 янв 2019', Keys.BACKSPACE, '', 0, 0, 1);
        expect(res3.action).toBe(Action.NONE);
    });
});

describe('Section features (replaceMode = false, defaultOptions = false)', () => {
    const intl = new InternationalizationService();
    const mask = new Mask(intl);
    mask.pattern = 'dd mmm yyyy';
    mask.settings = new MaskSettings('_');
    mask.settings.replaceMode = false;
    mask.settings.defaultOptions = false;
    mask.settings.incDecByArrows = true;
    const section = mask.sections[0]!;
    const monthSection = mask.sections[1]!;

    it('Select last char of first section ', () => {
        const res = section.selectLast('12 янв 2019', 0);
        expect(res.selStart).toBe(1);
        expect(res.selLength).toBe(0);
    });

    it('Set default month', () => {
        const res = monthSection.setDefaultVariant('31 ', 3);
        expect(res).toBe('31 ');
    });

    it('Prev day by down arrow key', () => {
        const res3 = section.applyKey('30 янв 2019', Keys.DOWN, '', 0, 0, 1);
        expect(res3.newValue).toBe('29 янв 2019');
    });

    it('Next day by up arrow key', () => {
        const res3 = section.applyKey('30 янв 2019', Keys.UP, '', 0, 0, 1);
        expect(res3.newValue).toBe('31 янв 2019');
    });

    it('Prev month by down arrow key', () => {
        const res3 = monthSection.applyKey('31 янв 2019', Keys.DOWN, '', 3, 5, 1);
        expect(res3.newValue).toBe('31 дек 2019');
    });

    it('Next month by up arrow key', () => {
        const res3 = monthSection.applyKey('31 янв 2019', Keys.UP, '', 3, 5, 1);
        expect(res3.newValue).toBe('31 фев 2019');
    });
});
