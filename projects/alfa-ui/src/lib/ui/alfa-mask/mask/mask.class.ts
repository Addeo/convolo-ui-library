/* eslint-disable @typescript-eslint/prefer-for-of,eqeqeq */


import { Keys } from '../keys/keys.class';
import { MaskSectionType } from './mask-section-type.class';
import { Action, MaskResult, MaskSection } from './mask-section.class';
import { MaskSettings } from './mask-settings.class';

// @dynamic
export class Mask {
    // Settings by default
    public static readonly defaultSettings: MaskSettings = new MaskSettings(' ');

    // Delimiters
    public static readonly delimiterChars: string = " .,()/|-:+ '";

    // Predefined section types
    public static readonly sectionTypes: MaskSectionType[] = [
        // Time components
        { selectors: ['HE'], numeric: true, min: 0, max: 24, datePart: 'H' },
        { selectors: ['HH'], numeric: true, min: 0, max: 23, datePart: 'H' },
        { selectors: ['h'], numeric: true, min: 1, max: 12, datePart: 'h' },
        { selectors: ['hh'], numeric: true, min: 1, max: 12, datePart: 'h' },
        { selectors: ['mi', 'MI'], numeric: true, min: 0, max: 59, datePart: 'mi' },
        { selectors: ['ss', 'SS'], numeric: true, min: 0, max: 59, datePart: 'ss' },
        { selectors: ['TT', 'AM', 'PM'], numeric: false, options: ['AM', 'PM'], datePart: 'tt' },
        { selectors: ['tt', 'am', 'pm'], numeric: false, options: ['am', 'pm'], datePart: 'tt' },
        { selectors: ['fff'], numeric: true, datePart: 'ms' }, // Milliseconds

        // Date components
        { selectors: ['dd', 'DD'], numeric: true, min: 1, max: 31, datePart: 'd' },
        { selectors: ['mm', 'MM'], numeric: true, min: 1, max: 12, datePart: 'm' },
        { selectors: ['mmm'], numeric: false, datePart: 'm' },
        { selectors: ['MMM'], numeric: false, datePart: 'm' },
        { selectors: ['yy', 'YY'], numeric: true, min: 0, max: 99, datePart: 'yy' },
        { selectors: ['yyyy', 'YYYY'], numeric: true, min: 0, max: 9999, datePart: 'yyyy' },

        // Byte (from 0 to 255) - for ip-address or network mask
        { selectors: ['b'], numeric: true, min: 0, max: 255 },

        // Plus/minus
        { selectors: ['~'], numeric: false, regExp: /[-+]/ },

        // Letter or digit
        { selectors: ['*'], numeric: false, regExp: /[a-zA-Z0-9]/ },

        // Letters
        { selectors: ['l', 'L'], numeric: false, regExp: /[a-zA-Z]/ },

        // Digits
        { selectors: ['n', 'N'], numeric: false, regExp: /\d/ },
    ];

    // Settings
    private _settings: MaskSettings | null = null;

    // Sections with section chars
    private readonly singles: string = '*aAnN#0';

    // The list of sections
    public sections: Array<MaskSection> = [];

    // Pattern of mask
    private _pattern: string = '';

    public static maskWithPattern( pattern: string): Mask {
        const mask = new Mask();
        mask.pattern = pattern;
        return mask;
    }

    public set settings(o: MaskSettings) {
        this._settings = o;
        this.sections.forEach((s) => (s.settings = o));
        this.updateMask();
    }

    public get settings(): MaskSettings {
        return this._settings ?? Mask.defaultSettings;
    }

    public set pattern(v: string) {
        this._pattern = v;
        this.updateMask();
    }

    public get pattern(): string {
        return this._pattern;
    }

    // Определяем тип секции по шаблону
    public selectSectionType(s: string): MaskSectionType | undefined {
        // First, look in the settings // Сначала в настройках
        const res: MaskSectionType | undefined = this.settings.sectionTypes.find(
            (i) => i.selectors.find((sel) => sel == s) != null,
        );
        if (res != null) return res;

        // Then, in predefined section types // Затем среди предустановленных
        return Mask.sectionTypes.find((i) => i.selectors.find((sel) => sel == s) != null);
    }

    // Определяем, существуют ли типы секций, которые начинаются на заданный символ.
    private selectSectionTypeByFirstChar(char: string): MaskSectionType | undefined {
        // Сначала поищем в опциях
        const res: MaskSectionType | undefined = this.settings.sectionTypes.find(
            (i) => i.selectors.find((sel) => sel[0] == char) != null,
        );
        if (res != null) return res;

        // Затем, среди стандартных
        return Mask.sectionTypes.find((i) => i.selectors.find((sel) => sel[0] == char) != null);
    }

    // Добавляет в список секций пустую секцию, имеющую разделитель
    private addEmptySection(delimiter: string): void {
        this.sections.push(new MaskSection( this.settings, '', delimiter));
    }

    // Добавление секции в список
    private addSection(section: string, delimiter: string): void {
        const sType = this.selectSectionType(section);

        if (!sType) {
            // Если секция не распознана - считаем это фиксированным текстом
            // и для каждого символа создаем пустую секцию с разделителем - этим
            // символом. Тогда маска будет принимать только их и переходить к
            // следующей секции
            for (let i = 0; i < section.length; i++) this.addEmptySection(section[i]!);

            // Про разделители тоже нужно не забыть
            for (let i = 0; i < delimiter.length; i++) this.addEmptySection(delimiter[i]!);

            return;
        }

        const s = new MaskSection( this.settings, section, delimiter, sType);

        // Так-то вообще, если разделитель длиннее одного символа,
        // нам нужно добавить пустые секции для всех символов кроме первого.
        // Но пока не будем здесь усложнять...
        s.delimiter = delimiter;
        this.sections.push(s);
    }

    // Получаем чистое значение без разделителей
    // Для преобразования из одного шаблона в другой.
    // Годится только для шаблонов, в котором все секции имеют фиксированную длину
    public pureValue(value: string): string {
        if (value == null) return value;

        let sectionPos = 0;
        let res = '';
        this.sections.forEach((section) => {
            const v = section.extract(value, sectionPos);
            res += section.removePlaceholders(v.section.value());
            sectionPos = v.nextSectionPos();
        });

        return res;
    }

    // Применяем чистое значение к шаблону и возвращаем форматированное значение
    public applyPureValue(value: string): string {
        //
        if (value == null) return value;

        const sectionPos = 0;
        let res = '';
        let i = 0;
        this.sections.forEach((section) => {
            const l = section.section.length;
            const s = value.substring(i, i + l);
            res += s;
            i += l;
            if (value.length >= i) res += section.delimiter;
        });

        if (this.settings.appendPlaceholders) res = this.appendPlaceholders(res);

        return res;
    }

    // Разбиваем строку маски на секции между разделителями
    public updateMask(): void {
        this.sections = [];

        let s: string;

        // Выбор формата на по локализации
        switch (this._pattern) {

            default:
                s = this._pattern;
        }

        if (!s || s.length === 0) {
            return;
        }

        const delimiter = '';

        let i = 0;
        while (i < s.length) {
            const c = s[i]!;
            let sType: MaskSectionType | undefined;
            let part = '';

            if (this.singles.includes(c)) {
                part = c;
                sType = this.selectSectionType(c);
            } else {
                for (let j = s.length; j >= i; j--) {
                    part = s.substring(i, j);
                    sType = this.selectSectionType(part);
                    if (sType) break;
                }
            }

            if (sType) {
                // Нужно добить разделителем
                i += part.length;
                let del = '';
                while (Mask.delimiterChars.includes(s[i]!)) {
                    del += s[i];
                    i++;
                }

                // Не найден разделитель
                if (del == '') {
                    // Если на текущий символ не найдется секции..
                    if (i < s.length && this.selectSectionTypeByFirstChar(s[i]!) == null) {
                        // ..то это тоже разделитель
                        del = s[i]!;
                        i++;
                    }
                }

                this.addSection(part, del);
                continue;
            }

            this.addSection('', c);
            i++;
        }
    }

    // Добавляем плэйсхолдеры к значению
    protected appendPlaceholders(value: string): string {
        let sectionStart = 0;
        let i = 0;
        while (i < this.sections.length) {
            const section = this.sections[i]!;
            const v = section.extract(value, sectionStart);

            while (v.section.length < section.length) v.section.append(this.settings.placeholder);

            v.delimiter = section.delimiter;

            // Обновляем значение и позицию следующей секции
            value = v.value();
            sectionStart = v.nextSectionPos();
            i++;
        }
        return value;
    }

    public checkMask(value: string | null): boolean {
        if (value === null) {
            return false;
        }
        if (value === '' && this.pattern !== '') {
            return false;
        }
        return this.applyMask(value) !== '';
    }

    // Форматирование строки по маске
    // Пустая строка будет означать инвалидность
    public applyMask(value: string, autoCorrect: boolean = true): string {
        let sectionPos = 0;
        let res = value;

        for (let i = 0; i < this.sections.length; i++) {
            const section = this.sections[i]!;
            const v = section.extract(res, sectionPos);

            v.delimiter = section.delimiter;

            let sv = v.section.value();

            sv = section.removePlaceholders(sv);

            if (section.isNumeric()) {
                // Invalid number value
                const n = section.numericValue(sv);
                if (Number.isNaN(n) || sv === '') {
                    return '';
                }
            }

            if (sv.length < section.length) {
                if (section.sectionType && section.sectionType.datePart) {
                    const dp = section.sectionType.datePart;
                    if (dp === 'yyyy' && sv.length !== 2) {
                        // For year we can accept value with 2 digits
                        return '';
                    }
                } else {
                    return '';
                }
            }

            if (autoCorrect) {
                sv = section.autoCorrectVal(sv);
            }

            res = v.update(sv, 0);
            sectionPos = v.nextSectionPos();
        }

        res = res.substring(0, sectionPos);
        return res;
    }

    // Применяем заданный символ к заданному значению в заданном месте
    public applyKeyAtPos(
        value: string,
        key: number,
        char: string,
        selStart: number,
        selEnd: number = 0,
    ): any {
        const selLength = selEnd - selStart;

        let sectionStart: number = 0;
        let section: MaskSection | null = null;
        let prevSection: MaskSection | null = null;
        let prevSectionStart: number = 0;
        let acceptDelimiterChars = true;

        // Добавляем плэйсхолдеры перед обработкой. Чтобы обработчик мог их учитывать
        // при расчете следующей позиции курсора
        if (this.settings.appendPlaceholders) value = this.appendPlaceholders(value);

        for (let i = 0; i < this.sections.length; i++) {
            section = this.sections[i]!;

            // Обработка пользовательского действия
            let res: MaskResult = section.applyKey(
                value,
                key,
                char,
                sectionStart,
                selStart,
                selLength,
                acceptDelimiterChars,
                i === this.sections.length - 1,
            );

            // Нельзя ничего применить
            if (res.action === Action.NONE) return null;

            // Добавляем еще раз плэйсхолдеры
            if (this.settings.appendPlaceholders)
                res.newValue = this.appendPlaceholders(res.newValue);

            // Готово!
            if (res.action === Action.APPLY) return res;

            // Идем в конец предыдущей секции
            // И применяем Delete
            if (res.action == Action.GO_BACK_AND_DELETE && prevSection != null) {
                res = prevSection.selectLast(res.newValue, prevSectionStart, true);
                res = prevSection.applyKey(
                    res.newValue,
                    Keys.DELETE,
                    '',
                    prevSectionStart,
                    res.selStart,
                    res.selLength,
                );
                return res;
            }

            // Идем в конец предыдущей секции
            if (res.action == Action.GO_BACK && prevSection != null) {
                return prevSection.selectLast(res.newValue, prevSectionStart);
            }

            // Идем в начало следующей секции
            if (res.action == Action.GO_FWD) {
                if (i < this.sections.length - 1) {
                    const nextSection = this.sections[i + 1]!;
                    const valueWithDefaultVariant = nextSection.setDefaultVariant(
                        res.newValue,
                        res.nextSectionPos,
                    );
                    return nextSection.selectFirst(valueWithDefaultVariant, res.nextSectionPos);
                }
                // The last section. Correct value.
                return section.autoCorrect(res.newValue, sectionStart, res.selStart, res.selLength);
            }

            // Skipped section
            if (res.action == Action.SKIP) {
                // Запомним положение текущей секции и саму секцию для возврата по BACKSPACE
                // и стрелке влево
                if (section !== null && section.section !== '') {
                    // Это условие для того, чтобы нельзя было вернуться на секции
                    // без значащих символов
                    prevSection = section;
                    prevSectionStart = sectionStart;
                }

                // Больше не будем принимать символы разделителей, т.к.
                // мы его отвергли в одной из предыдущей секций
                // Example - +7 921 911 11 11 - в начале строки жмем 7, но + его не принял
                // Тогда это будет значащий символ уже
                if (section.section == '' && selStart < res.nextSectionPos)
                    acceptDelimiterChars = false;

                // Даже если мы передали управление следующей секции, значение может
                // измениться - могут быть добавлены разделители или скорректированы значения
                value = res.newValue;
                selStart = res.selStart;
                sectionStart = res.nextSectionPos;

                continue;
            }

            // Value is finished
            if (sectionStart > value.length) {
                return null;
            }
        }

        return null;
    }


    constructor() {
        // Subscribe for localization change event. We have to update month names.
    }
}
