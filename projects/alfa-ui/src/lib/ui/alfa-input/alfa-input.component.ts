import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AlfaAbstractFormControl } from '../abstract-control';
import { AlfaErrorModule } from '../alfa-error';
// import { CnvIconName, CnvIconsModule } from '$components/alfa-icons';
import { AlfaMaskModule, MaskSettings } from '../alfa-mask';
// import { CnvTooltipModule } from '$components/alfa-tooltip';
import {
  AlfaCustomInputType,
  AlfaInputSize,
  AlfaInputType,
} from './alfa-input.interface';
// import { CnvNoteComponent, CnvNoteType } from '$components/alfa-note';


@Component({
    selector: 'alfa-input',
    templateUrl: './alfa-input.component.html',
    styleUrls: ['./alfa-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
      class: 'alfa-input',
    },
    standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AlfaErrorModule],
})
export class AlfaInputComponent  extends AlfaAbstractFormControl<null | string | number | Date>
  implements OnInit, OnDestroy
{
  /** TODO FUTURE CUSTOMIZE PROPS WITH ONE FIELD */
  // @Input() public field: AlfaInputField | null = null;
  /** Help Tooltip in label - default info icon */
  @Input() helpTooltip?: string;
  /** Note text */
  @Input() noteText?: string;
  /** Note type */
  // @Input() noteType?: CnvNoteType;
  /** Note Accordion Button text */
  @Input() noteAccordionText?: string;
  /** Custom type of the element */
  @Input() public type: AlfaCustomInputType = 'text';
  /** Default country data */
  @Input() public country = '';
  /** Data type of the element */
  @Input() public inputType: AlfaInputType = 'text';
  /** Field size */
  @Input() public size: AlfaInputSize = 'normal';
  /** Short hint intended to aid the user with data entry when the control has no value */
  @Input() public placeholder = '';
  /** Control label */
  @Input() public label?: string;
  /** Left text */
  @Input() public isLeftLabel: boolean = false;
  /** Helper text */
  @Input() public helperText?: string;
  /** Minimum value for inputType="number" */
  @Input() public min?: number | string;
  /** Maximum value for inputType="number" */
  @Input() public max?: number | string;
  /** Maximum length of input text in number of characters */
  @Input() public maxLength?: number | string;
  /** Step for inputType="number" */
  @Input() public step?: number | string;
  /** Text mask */
  @Input() public mask?: string;
  /** Numeric mask */
  @Input() public maskNumber?: string;
  /** Date mask */
  @Input() public maskDate?: string;
  /** Settings for mask */
  @Input() public maskSettings?: MaskSettings;
  /** Autocomplete */
  @Input() public autocomplete?: string;
  /** Debounce time in ms */
  @Input() public debounce?: number;
  // /** Icon at the start of input */
  // @Input() public prefixIcon?: CnvIconName;
  // /** Icon at the end of input */
  // @Input() public suffixIcon?: CnvIconName;
  // /** Button at the end of input */
  // @Input() public suffixButton?: CnvIconName;
  /** Button clear value */
  @Input() public clearable?: boolean = false;

  @Input() get phone() {
    return this.phoneValue;
  }

  set phone(val) {
    this.phoneValue = val;
    this.phoneValueChange.emit(this.phoneValue);
  }

  @Input()
  get isValidNumber() {
    return this.isValidNumberValue;
  }

  set isValidNumber(val) {
    this.isValidNumberValue = val;
    this.isValidNumberChange.emit(val);
  }

  @Output() phoneValueChange = new EventEmitter();
  @Output() isValidNumberChange = new EventEmitter();

  /** Event when focusing on an input */
  @Output() public inputFocus = new EventEmitter<FocusEvent>();
  /** Event when focus is removed from input */
  @Output() public inputBlur = new EventEmitter<FocusEvent>();
  @Output() public suffixButtonClicked = new EventEmitter<void>();

  // /** Event change country data */
  @Output() public countryDataChanged = new EventEmitter<any>();

  /** Link to internal input */
  @ViewChild('input') public inputRef!: ElementRef<HTMLInputElement>;

  // @ts-ignore
  @HostBinding('class.alfa-input_error') public errorState = false;
  @HostBinding('class.alfa-input_disabled') public disabledState = false;

  @HostBinding('class')
  public get classes(): string {
    return `alfa-input_size_${this.size}`;
  }

  @HostBinding('class.alfa-input_with-prefix')
  public get hasPrefix(): boolean {
    // TODO: can be removed when `:has` selector will be available
    // @ts-ignore
    return ''
    // !!this.prefixIcon;
  }

  @HostBinding('class.alfa-input_with-suffix')
  public get hasSuffix(): boolean {
    // TODO: can be removed when `:has` selector will be available
    // @ts-ignore
    return ''
    // !!(this.suffixButton || this.suffixIcon);
  }

  phoneValue = '';

  isValidNumberValue = false;

  private changeValue$ = new Subject<null | string | number | Date>();

  /** @ignore */
  constructor(
    // @ts-ignore
    protected changeDetectorRef: ChangeDetectorRef,
    // @ts-ignore
    @Self() @Optional() public ngControl: NgControl,
  ) {
    super(changeDetectorRef, ngControl);
    // @ts-ignore
    if (this.field) {
      // @ts-ignore
      for (const item of Object.entries(this.field)) {
      }
    }
  }

  /** @ignore */
  public ngOnInit(): void {
    this.changeValue$
      .pipe(debounceTime(this.debounce!))
      .pipe(this.takeUntilDestroy())
      .subscribe((value) => {
        this.processValueChange(value);
      });
  }

  /** Changing the value of a control */
  public changeValue(value: null | string | number | Date): void {
    if (this.debounce === undefined) {
      this.processValueChange(value);
    } else {
      this.changeValue$.next(value);
    }
  }

  /** Fires when data is entered into an input */
  public onInput(event: Event): void {
    let value: null | string | number | Date = (event.target as HTMLInputElement).value;
    if (this.inputType === 'number') {
      this.errorState = false;
      value = (event.target as HTMLInputElement).valueAsNumber;
      if (Number.isNaN(value)) {
        value = null;
      }
    }
    this.changeValue(value);
  }

  /** Called by the forms API */
  // @ts-ignore
  public setDisabledState(isDisabled: boolean): void {
    this.disabledState = isDisabled;
    super.setDisabledState(isDisabled);
  }

  /** Sets focus on element */
  public focus(): void {
    this.inputRef.nativeElement.focus();
  }

  /** Removes focus from element */
  public blur(): void {
    this.inputRef.nativeElement.blur();
  }

  /** Fires when focus is set to control */
  protected onFocus(event: FocusEvent): void {
    // TODO FIX THIS EVENT
    // if (this.type === 'phone') {
    //     this.isValidNumberChange.emit(this.iti.isValidNumber());
    //     this.phoneValueChange.emit(this.iti.getNumber());
    // }
    this.inputFocus.emit(event);
  }

  /** Fires when the focus is removed from the control */
  protected onBlur(event: FocusEvent): void {
    this.onTouched();
    this.inputBlur.emit(event);

    if (this.inputType === 'number') {
      if (this.ngControl) {
        this.processStatusChanges();
      }
    }
  }

  /** Fires when the button at the end of input is clicked */
  protected onSuffixButtonClick(): void {
    this.suffixButtonClicked.emit();
  }

  /** Handling value change */
  private processValueChange(value: null | string | number | Date): void {
    this.onChange(value);
    this.valueChanged.emit(value);
  }

  onClearClick() {
    this.value = null;
    this.onChange(null);
    this.valueChanged.emit(null);
  }
}
