import {
    AfterViewInit,
    ChangeDetectorRef,
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    Optional,
    Output,
    Self,
    SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';
import { BaseComponent } from '../base-component/base-component.component';
import { AlfaErrorHandlersRecord } from '../alfa-error';
import {randomString} from "../../utils/random-string.util";

// import { randomString } from '$utils/random-string.util';

/**
 * Abstract form control with ControlValueAccessor implementation.
 */
@Directive({
    selector: '[alfaAlfaAbstractFormControl]',
    standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class AlfaAbstractFormControl<T, U = T>
    extends BaseComponent
    implements ControlValueAccessor, OnChanges, AfterViewInit
{
    /** Control ID */
    @Input() public id: string = randomString(5);
    /** Initial value */
    @Input() public value: T | null = null;
    /** Whether the form control is disabled. */
    @Input() public disabled = false;
    /** Whether to allow the value to be edited by the user. */
    @Input() public readonly = false;
    /** List of validation error handlers that return the error text. */
    @Input() public errorMessages?: AlfaErrorHandlersRecord;
    /** Own error message. If passed, no other messages are displayed. */
    @Input() public errorMessage?: string;

    /** Dispatching control value change event */
    @Output() public valueRawChanged = new EventEmitter<U | null>();

    /** Dispatching control value change event */
    @Output() public valueChanged = new EventEmitter<U | null>();

    /** Control validity */
    public errorState = false;

    /** Current validation errors */
    public validationErrors: ValidationErrors | undefined | null;

    /** @ignore */
    constructor(
        protected changeDetectorRef: ChangeDetectorRef,
        @Self() @Optional() public ngControl: NgControl | null,
    ) {
        super();

        if (this.ngControl !== null) {
            this.ngControl.valueAccessor = this;
        }
    }

    /** @ignore */
    public ngOnChanges(changes: SimpleChanges): void {
        this.onTouched();
    }

    /** @ignore */
    public ngAfterViewInit(): void {
        if (this.ngControl) {
            this.ngControl.control?.statusChanges.pipe(this.takeUntilDestroy()).subscribe(() => {
                this.processStatusChanges();
            });
        }
    }

    /** Handling a change in the state of a control in a FormGroup */
    protected processStatusChanges(): void {
        if (!this.ngControl) return;

        this.errorState = !!(this.ngControl.invalid && this.ngControl.dirty);
        this.validationErrors = this.ngControl.control?.errors;
        this.changeDetectorRef.markForCheck();
    }

    /** Writes a new value to the element. */
    public writeValue(value: T | null): void {
        this.value = value;
    }

    /**
     * Registers a callback function that is called by the forms API on initialization to update the form model on blur.
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /** Registers a callback function that is called when the control's value changes in the UI. */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Function that is called by the forms API when the control status changes to or from 'DISABLED'.
     * Depending on the status, it enables or disables the appropriate DOM element.
     */
    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.changeDetectorRef.markForCheck();
    }

    /** @ignore */
    protected onChange(value: T | null): void {}

    /** @ignore */
    protected onTouched(): void {}
}
