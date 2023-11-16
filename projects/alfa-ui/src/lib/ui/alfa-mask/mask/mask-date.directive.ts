/* eslint-disable eqeqeq */
import {
    Directive,
    ElementRef,
    forwardRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateParserFormatter } from '../dates/date-parser-formatter.class';

import { MaskBaseDirective } from './mask-base.directive';
import { MaskSettings } from './mask-settings.class';
import { MaskState } from './mask-state.class';

@Directive({
    selector: '[cnvMaskDate]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MaskDateDirective),
            multi: true,
        },
    ],
})
export class MaskDateDirective
    extends MaskBaseDirective
    implements ControlValueAccessor, OnInit, OnDestroy
{
    private _dateValue: any;

    public localeSubscription: any;

    private onChange = (_: any): void => {};

    private onTouched = (): void => {};

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }

    @HostListener('input', ['$event'])
    public onInput($event: InputEvent): void {
        this.input(($event.target as HTMLInputElement).value);
    }

    @HostListener('blur')
    public onBlur(): void {
        this.blur();
    }

    // Focus lost
    public blur(): void {
        // No need to parse once more if result is as expected
        const autoCorrected = this._mask.applyMask(this._txtValue);
        if (autoCorrected != this._txtValue) this.setText(autoCorrected);

        // Clearing if Date is incorrect
        if (this._dateValue == null || Number.isNaN(this._dateValue.getTime())) {
            if (!this._mask.settings.allowIncomplete) this.setText('');
        }

        this.onTouched();
    }

    // Updating the state
    protected override updateState(): void {
        if (this._dateValue == null) {
            this.state = MaskState.EMPTY; // empty value
        } else {
            if (Number.isNaN(this._dateValue.getTime())) {
                this.state = MaskState.TYPING; // User input is in progress
            } else {
                this.state = MaskState.OK;
            }
        }
    }

    // Sending a value to model
    protected override toModel(): void {
        // Retrieving value
        this._dateValue = DateParserFormatter.parse(this._txtValue, this._mask);
        // Sending to model
        this.onChange(this._dateValue);
        // Updating the state
        this.updateState();
    }

    //
    public override processKey(e: any): boolean | undefined {
        return super.processKey(e);
    }

    // Parser: View --> Ctrl
    public input(txt: any): void {
        this.doInput(txt);
    }

    // Formatter: Ctrl --> View
    public writeValue(value: any): void {
        this._dateValue = value;
        const txt = DateParserFormatter.format(value, this._mask);
        if (txt != this._txtValue) this.setText(txt, false);

        // No need to send to model, because this processor is called on model change
        // but state still needs to be updated
        this.updateState();
    }

    @Input('cnvMaskDate')
    public set pattern(m: string) {
        this._mask.pattern = m;
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

    public setLocale(): void {
        // Change format
        this._mask.updateMask();
        // Update view
        this.writeValue(this._dateValue);
    }

    public ngOnInit(): void {
        // Format change can follow locale change
        // this.localeSubscription = this.intl.onLocaleChange.subscribe((locale) => {
        //     this.setLocale(locale);
        // });
    }

    public ngOnDestroy(): void {
        // Unsubscribing
        this.localeSubscription.unsubscribe();
    }

    constructor(
        protected renderer: Renderer2,
        protected elementRef: ElementRef,
    ) {
        super(renderer, elementRef);
    }
}
