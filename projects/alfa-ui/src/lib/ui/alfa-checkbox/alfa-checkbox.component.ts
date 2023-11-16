import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Self,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { AlfaAbstractFormControl } from '../abstract-control';

// import { randomString } from '$utils/random-string.util';

export type AlfaCheckboxSize = 'small' | 'large';

/**
 * Checkbox.
 *
 * @example
 * ```html
 * <alfa-checkbox
 *   size="small"
 *   [disabled]="disabled"
 *   (valueChanged)="onChangeValue($event)">
 * </alfa-checkbox>
 * ```
 */
@Component({
    selector: 'alfa-checkbox',
    templateUrl: './alfa-checkbox.component.html',
    styleUrls: ['./alfa-checkbox.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        class: 'alfa-checkbox',
    },
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AlfaCheckboxComponent
    extends AlfaAbstractFormControl<boolean>
    implements OnChanges, OnDestroy
{
    /** Size modifier */
    @Input() public size: AlfaCheckboxSize = 'large';
    /** Control label */
    @Input() public label?: string;
    /** Control ID */
    // @Input() public id: string = randomString(5);
    /** Link to internal input */
    @ViewChild('input') public inputRef!: ElementRef<HTMLInputElement>;

    /** Classes on parent element */
    @HostBinding('class')
    public get classes(): string {
        return `
      alfa-checkbox
      alfa-checkbox_size_${this.size}
    `;
    }

    /** @ignore */
    constructor(
        protected override changeDetectorRef: ChangeDetectorRef,
        @Self() @Optional() public override ngControl: NgControl,
    ) {
        super(changeDetectorRef, ngControl);
    }

    /** @ignore */
    public override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        // @ts-ignore
        if (changes.indeterminate?.currentValue === true) {
            this.onChange(null);
        }
    }

    /** Fires when the control's value changes */
    public onCheckboxChange(value: boolean): void {
        this.onChange(value);
        this.valueChanged.emit(value);
    }

    /** Sets focus on the element */
    public focus(): void {
        this.inputRef.nativeElement.focus();
    }

    /** Removes focus from the element */
    public blur(): void {
        this.inputRef.nativeElement.blur();
    }

    public setValue(value: boolean): void {
        this.value = value;
        this.changeDetectorRef.markForCheck();
    }
}
