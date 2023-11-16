/* eslint-disable eqeqeq */
import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskBaseDirective } from './mask-base.directive';
import { MaskSettings } from './mask-settings.class';
import { MaskState } from './mask-state.class';

@Directive({
    selector: '[cnvMask]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MaskDirective),
            multi: true,
        },
    ],
})
export class MaskDirective extends MaskBaseDirective implements ControlValueAccessor {
    private onChange = (_: any): void => {};

    private onTouched = (): void => {};

    @HostListener('input', ['$event'])
    public onInput($event: InputEvent): void {
        this.input(($event.target as HTMLInputElement).value);
    }

    @HostListener('blur')
    public onBlur(): void {
        this.blur();
    }

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }

    public blur(): void {
        // Очищаем, если маска неверна
        const autocorrected = this._mask.applyMask(this._txtValue);
        if (autocorrected === '' && !this._mask.settings.allowIncomplete) this.setText('');
        else {
            // Маска верна, но нужно автокоррекцию провернуть
            if (autocorrected != this._txtValue) this.setText(autocorrected);
        }

        this.onTouched();
    }

    // Пользователь вносит значение. Parser: View --> Ctrl
    // Только то, что не обработано маской
    public input(txt: any): void {
        this.doInput(txt);
    }

    // Обновляем состояние
    protected override updateState(): void {
        if (this._txtValue == '') {
            this.state = MaskState.EMPTY; // Пустое значение
        } else {
            if (!this._mask.checkMask(this._txtValue)) {
                this.state = MaskState.TYPING; // Считаем, что пользователь не завершил ввод
            } else {
                this.state = MaskState.OK;
            }
        }
    }

    protected override toModel(): void {
        // Отправляем в модель
        this.onChange(this._txtValue);
        // Обновляем состояние
        this.updateState();
    }

    // Отображаем значение в компоненте. Formatter: Ctrl --> View
    public writeValue(txt: any): void {
        if (this._txtValue != txt) {
            // Не отправляем значение в модель, т.к. этот метод вызывается как раз после изменения модели
            this.setText(txt, false);
        }

        // Но обновить состояние нужно...
        this.updateState();

        // writeValue вызывается формгруппой, записывает значение без разделителей, обновляем
        const autocorrected = this._mask.applyMask(this._txtValue);
        if (autocorrected !== '' || this._mask.settings.allowIncomplete) {
            if (autocorrected != this._txtValue) {
                this.setText(autocorrected);
            }
        }
    }

    @Input('cnvMask')
    public set pattern(m: string) {
        if (this._txtValue != '' && this._mask.pattern != '' && this._mask.pattern != m) {
            // По сложному пути
            const res = this.currentRes();
            const s = this._mask.pureValue(res.newValue);
            this._mask.pattern = m;
            res.newValue = this._mask.applyPureValue(s);
            this.setRes(res);
        } else {
            this._mask.pattern = m;
        }
    }

    public get pattern(): string {
        return this._mask.pattern;
    }

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('cnvMaskSettings')
    public set settings(v: MaskSettings) {
        this._mask.settings = v;
    }

    @HostListener('keydown', ['$event'])
    public keyDown(e: any): boolean | undefined {
        return this.processKey(e);
    }

    constructor(
        protected renderer: Renderer2,
        protected elementRef: ElementRef,
    ) {
      // @ts-ignore
        super(renderer, elementRef);
    }
}
