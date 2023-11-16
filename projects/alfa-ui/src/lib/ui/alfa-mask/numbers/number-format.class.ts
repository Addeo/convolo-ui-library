export class NumberFormat {
    public static specifiers = 'AEDFNPRaedfnpr';
    public static digits = '0123456789';

    public prefixSignum = '';

    public prefix = '';
    public postfix = '';

    // P - positive value, D - десятичная, E - экспоненциальная, F - шестнадцатеричная
    public specifier = 'D';

    public signum: boolean = true; // Обязательно нужен знак (даже +)

    public intMin = 1;
    public intMax = 16;

    public fractionMin = 0;
    public fractionMax = 0;

    public static isDigit(char: string): boolean {
        return NumberFormat.digits.includes(char);
    }

    // Формат в виде "${1.2}" -- префикс [$ ], потом минимум одна цифра целого, затем только две цифры после точки
    // Формат в виде "${1.2-5}" -- префикс [$ ], потом минимум одна цифра целого, затем от двух до пяти цифр дроби
    // Еще попробуем такой формат: ~${A1.2-5} или {{$}1.2-5} - сначала знак, потом
    //  {E.4} - экспоненциальная форма с максимум 4 знаками после запятой
    // {+E.4} - обязательно знак
    public static parseFormat(formatTxt: string): NumberFormat | null {
        const splitted = formatTxt.split(/[{}]/);

        if (splitted.length < 3) return null;

        const res = new NumberFormat();

        res.prefixSignum = '';
        res.prefix = splitted[0]!;
        if (res.prefix.length > 0 && '~+-'.includes(res.prefix[0]!)) {
            res.prefixSignum = res.prefix[0]!;
            res.prefix = res.prefix.slice(1);
        }

        const format = splitted[1]!.trim();
        res.postfix = splitted[2]!;

        const digits = { int: '', intMax: '', fMin: '', fMax: '' };

        let part = 'spec';
        for (let pos = 0; pos < format.length; pos++) {
            const char = format[pos]!;

            const isDigit = NumberFormat.isDigit(char);

            if (!isDigit && !`${this.specifiers}+-. `.includes(char)) {
                return null;
            }

            if (pos === 0 && '+-'.includes(char)) {
                res.signum = true;
            }

            // Задается спецификатор
            if (part === 'spec' && this.specifiers.includes(char)) {
                res.specifier = char.toUpperCase();
                part = 'int';
                continue;
            }

            if ((part === 'spec' || part === 'int') && isDigit) {
                digits.int += char;
                part = 'int';
                continue;
            }

            if (part === 'int' && char === '-') {
                part = 'intmax';
            }

            if (part === 'intmax' && isDigit) {
                digits.intMax += char;
            }

            if (char === '.') {
                part = 'fmin';
            }

            if (part === 'fmin' && char === '-') {
                part = 'fmax';
            }

            if (part === 'fmin' && isDigit) {
                digits.fMin += char;
            }

            if (part === 'fmax' && isDigit) {
                digits.fMax += char;
            }
        }

        if (digits.int !== '') {
            res.intMin = +digits.int;
        }

        if (digits.intMax !== '') {
            res.intMax = +digits.intMax;
        }

        if (digits.fMin !== '') {
            res.fractionMin = +digits.fMin;
        }

        if (digits.fMax !== '') {
            res.fractionMax = +digits.fMax;
        } else {
            res.fractionMax = res.fractionMin;
        }

        return res;
    }
}
