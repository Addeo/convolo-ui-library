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
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, isObservable, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, mergeMap, tap } from 'rxjs/operators';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';

// import { zoneFree } from '@src/app/helpers/helpers';
import { AlfaAbstractFormControl } from '../abstract-control';
import { AlfaErrorModule } from '../alfa-error';
import { AlfaPipesModule } from '../../pipes/alfa-pipes.module';
// import { AlfaIconsModule } from '$components/alfa-icons';
import { InteractiveElementsService } from '../../services/interactive-elements.service';
import { randomString } from '../../utils/random-string.util';
import {
  AlfaSelectDataFn,
  AlfaSelectLoadDataParams,
  AlfaSelectSize,
  AlfaSelectSpecialType,
} from './alfa-select.interface';
import { AlfaInputComponent } from '../alfa-input/alfa-input.component';
// import { AlfaTooltipModule } from '../alfa-tooltip';
// import { AlfaNoteComponent, CnvNoteType } from '../alfa-note';
import { DropdownPosition } from '@ng-select/ng-select/lib/ng-select.types';


@Component({
    selector: 'alfa-select',
    templateUrl: './alfa-select.component.html',
    styleUrls: ['./alfa-select.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'alfa-select',
    },
    standalone: true,
    imports: [NgSelectModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AlfaSelectComponent<T = Record<string, any>>
  extends AlfaAbstractFormControl<any>
  implements OnChanges, OnInit, AfterViewInit, OnDestroy{
  /** Help Tooltip in label - default info icon */
  @Input() helpTooltip?: string;
  /** Note text */
  @Input() noteText?: string;
  /** Note Accordion Button text */
  @Input() noteAccordionText?: string;
  /** Field size */
  @Input() public size: AlfaSelectSize = 'normal';
  /** An array of elements or an observer that returns an array of elements */
  @Input() public items?: any[] | Observable<any[]>;
  /** A function to get data, returning an observer. Used to load items in batches. */
  @Input() public loadDataFn?: AlfaSelectDataFn<T>;
  /** Object property used as a label */
  @Input() public bindLabel: string = 'label';
  /** Virtual scroll */
  @Input() public virtualScroll = true;
  /** Clears search input when item is selected. Default true. Default false when closeOnSelect is false */
  @Input() public clearSearchOnAdd = true;
  /** Possibility to change the text in the input field if the object is selected */
  @Input() public editableSearchTerm = false;
  /** Allows to create custom options */
  @Input() public addTag: boolean | ((term: string) => any | Promise<any>) = false;
  /**
   * The property of the object used as the value.
   * By default, the entire object is used.
   */
  @Input() public bindValue?: string;
  /** Allows to delete the selected value */
  @Input() public clearable = true;
  /** Helper text in header select */
  @Input() public helperOptionsText = 'Custom params fields';
  /** Close the list when an item is selected */
  @Input() public closeOnSelect?: boolean;
  /** Function to compare values */
  @Input() public compareWith?: (a: any, b: any) => boolean;
  /** Allow to group items by key or function expression */
  @Input() public groupBy?: string | ((value: any) => any);
  /**
   * Allows manual control of dropdown opening and closing:
   * - true — won't close,
   * - false — won't open.
   */
  @Input() public isOpen?: boolean;
  /** Can multiple values be selected */
  @Input() public multiple = false;
  /**
   * Maximum items with labels in multiple mode.
   * With 5 chosen items and `maxLabels=3` it will display like this:
   * [label 1] [label 2] [label 3] +2
   * With `maxLabels=0` you will see `5 items selected`.
   */
  @Input() public maxLabels: number = 3;
  /** Control label */
  @Input() public label?: string;
  /** Left text */
  @Input() public isLeftLabel: boolean = false;
  /** Field placeholder */
  @Input() public placeholder: string = '';
  /** Helper text */
  @Input() public helperText?: string;
  /** Search debounce in ms */
  @Input() public searchDebounce = 300;
  /** Load new values when the end of the dropdown list is reached */
  @Input() public infiniteScroll = true;
  /** Ref to template label */
  @Input() public labelTemplate?: TemplateRef<any>;
  /** Use header template search in options tab */
  @Input() public headerTemplateSearch: boolean = false;
  /** Use header template tags container in options tab */
  @Input() public headerTagsContainerTemplate: boolean = false;
  /** Use footer template search in options tab */
  @Input() public footerTemplateSearch: boolean = false;
  /** Ref to template option */
  @Input() public optionTemplate?: TemplateRef<any>;
  /** Open dropdown list when field is clicked */
  @Input() public openOnClick = true;
  /** Search for a value */
  @Input() public searchable = true;
  /** Select marked dropdown item using tab */
  @Input() public selectOnTab = false;
  /** Special options for customize styles in some cases */
  @Input() public specialType: AlfaSelectSpecialType = 'standard';
  /** Options for customize dropdown position*/
  @Input() public dropdownPosition: DropdownPosition = 'auto';

  /**
   * Rendering a dropdown on an arbitrary element to prevent it from overlapping the container that contains it.
   *
   * IMPORTANT! For the selector specified in this property, you must specify `position` property other than `static`,
   * for the correct positioning of the dropdown list.
   */
    // TODO
  @Input() public appendTo?: string;

  /** Only add function - not delete value or change, value not save*/
  @Input() public onlyAddFunction: boolean = false;

  /** Search event */
  @Output() public search = new EventEmitter<string>();

  /** Add event */
  @Output() public add = new EventEmitter<any>();

  /** Link to ng-select */
  @ViewChild('ngSelect') public ngSelect!: NgSelectComponent;

  /** Link to ng-select element */
  @ViewChild(NgSelectComponent, { read: ElementRef }) ngSelectRef!: ElementRef;

  /** Setting the class to the component if a value is selected in the select */
  @HostBinding('class.alfa-select_has-value') public hasValueStyle = false;

  /** Setting a class on a component if the select has an invalid value */
    // @ts-ignore
  @HostBinding('class.alfa-select_error') public errorState: boolean = false;

  @HostBinding('class')
  public get classes(): string {
    return `
      alfa-select_size_${this.size}
      ${this.isOpen === false ? 'alfa-select_no-open' : ''}
      ${this.virtualScroll === false ? 'not-virtual-scroll' : ''}
      ${this.specialType === 'date-picker' ? 'date-picker' : ''}
    `;
  }

  /** Array of elements */
  public ngsItems: any[] = [];
  /** Whether data is being loaded */
  public loading: boolean | undefined;
  /** Cache of items before search starts */
  protected beforeSearchNgItems: any[] = [];
  /** Flag for being in the search mode */
  protected isSearch = false;
  /** Subject of search */
  public typeahead: Subject<string> | undefined;

  /** Subscribing to asynchronous data */
  protected itemsLoadSubs: Subscription | null | undefined;
  /** Subscribe to get items by selected value */
  protected selectedItemsSubs: Subscription | undefined;
  /** Loading options when using loadDataFn, given to the outside */
  protected loadDataParams: AlfaSelectLoadDataParams = {
    pageSize: 10,
    /** -1 means no downloads yet */
    pageNumber: -1,
  };

  /** Keydown handler */
  public keyDownHandler = (event: KeyboardEvent): boolean =>
    !(event.key === 'Esc' || event.key === 'Escape');

  /** @ignore */
  constructor(
    // @ts-ignore
    protected changeDetectorRef: ChangeDetectorRef,
    protected interactiveElementsService: InteractiveElementsService,
    // @ts-ignore
    @Self() @Optional() public ngControl: NgControl,
    private ngZone: NgZone,
  ) {
    super(changeDetectorRef, ngControl);
  }

  /** @ignore */
  public ngOnInit(): void {
    this.id ??= randomString(5);
    this.hasValueStyle = this.hasValue();
    if (this.loadDataFn) {
      this.enableCustomSearch();
    }
  }

  /** @ignore */
  // @ts-ignore
  public ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    // @ts-ignore
    if (changes.bindLabel || changes.bindValue) {
      this.resetState();
    }
    // @ts-ignore
    if (changes.items?.currentValue) {
      this.disableCustomSearch();
      this.loadDataParams.pageNumber = -1;
      this.ngsItems = [];
      this.loadItems();
    }
    // @ts-ignore
    if (changes.loadDataFn?.currentValue) {
      this.enableCustomSearch();
    }
  }

  /** @ignore */
  // @ts-ignore
  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.ngSelect.classes = 'alfa-select__dropdown';

    fromEvent<MouseEvent>(this.ngSelectRef.nativeElement, 'mouseover')
      // @ts-ignore
      // .pipe(zoneFree(this.ngZone))
      .pipe(this.takeUntilDestroy())
      .subscribe(() => {
        const selectItems = this.ngSelectRef.nativeElement.querySelectorAll('.ng-option');

        selectItems.forEach((item: any) => {
          if ((item.offsetWidth ?? 0) < (item.scrollWidth ?? 0)) {
            item.setAttribute('title', item.innerText);
          }
        });
      });
  }
  // @ts-ignore
  ngOnDestroy(): void {}

  /** Dropdown open event handler */
  public onOpen(): void {
    this.interactiveElementsService.pushOpenedElement(this, () => {
      this.ngSelect?.close();
    });

    if (typeof this.loadDataFn === 'function' && this.loadDataParams.pageNumber < 0) {
      this.loadDataParams.searchTerm = '';
      this.loadItems();
    }
  }

  /** Fires when the end of the list of elements is reached */
  public onScrollToEnd(): void {
    if (this.items || !this.infiniteScroll) return;
    if (typeof this.loadDataFn === 'function') {
      this.loadItems();
    }
  }

  /** Fires on search (user types in select) */
  public onSearch({ term }: { term: string; items: any[] }): void {
    this.search.emit(term);
  }

  /** Fires when the value in the select changes */
  public onChangeModel(value: any): void {
    if (this.onlyAddFunction) {
      this.value = [];
      this.valueRawChanged.emit([]);
      this.hasValueStyle = this.hasValue();
      let outputValue: any;
      if (this.bindValue) {
        outputValue = this.multiple
          ? value.map((item: any) => item?.[this.bindValue!])
          : value?.[this.bindValue];
      } else {
        outputValue = value;
      }
      this.onChange(null);
      this.valueChanged.emit(null);
    } else {
      this.valueRawChanged.emit(value);
      this.hasValueStyle = this.hasValue();
      let outputValue: any;
      if (this.bindValue) {
        outputValue = this.multiple
          ? value.map((item: any) => item?.[this.bindValue!])
          : value?.[this.bindValue];
      } else {
        outputValue = value;
      }
      this.onChange(outputValue ?? null);
      this.valueChanged.emit(outputValue ?? null);
    }
  }

  /** Fires when the dropdown is closed */
  public onClose(): void {
    this.interactiveElementsService.removeOpenedElement(this);

    if (this.isSearch) {
      /**
       * Restore the elements of the list before the start of the search
       * and merge the elements selected during the search into the final list
       */
      this.isSearch = false;
      const values = this.normalizeValue(this.value);
      let newItems: any[] = [];
      if (this.bindValue) {
        newItems = values
          /** Find the values that are selected in the select and that are not in the cache */
          .filter(
            (value) =>
              !this.beforeSearchNgItems.find(
                (ngItem) => ngItem[this.bindValue!] === value,
              ),
          )
          /** Convert found values to items */
          .map((value) =>
            this.ngsItems.find((ngItem) => ngItem[this.bindValue!] === value),
          )
          .filter((value) => value);
      } else if (this.compareWith) {
        newItems = values
          /** Find the values that are selected in the select and that are not in the cache */
          .filter(
            (value) =>
              !this.beforeSearchNgItems.find((ngItem) =>
                this.compareWith!(ngItem, value),
              ),
          )
          /** Convert found values to items */
          .map((value) =>
            this.ngsItems.find((ngItem) => this.compareWith!(ngItem, value)),
          )
          .filter((value) => value);
      }
      this.ngsItems = this.beforeSearchNgItems.concat(newItems);
      this.beforeSearchNgItems = [];
    }
  }

  /**
   * Returns those selected elements in the select that are not in the current list of select elements
   * @param values array of selected elements
   */
  protected getValuesForRequest(values: any[]): any[] {
    /** Look for missing entries in existing items */
    if (this.bindValue) {
      return values.filter(
        (val) => !(this.ngsItems || []).find((ngItem) => ngItem[this.bindValue!] === val),
      );
    }
    if (this.compareWith) {
      return values.filter(
        (val) => !(this.ngsItems || []).find((ngItem) => this.compareWith!(ngItem, val)),
      );
    }
    return values.filter((val) => !(this.ngsItems || []).includes(val));
  }

  /**
   * Constructs parameters for the function of getting the selected values in the select
   * @param forReq the selected values in the select to be found
   */
  protected getSelectedValuesObsParams(forReq: any[]): AlfaSelectLoadDataParams {
    return {
      pageSize: forReq.length,
      pageNumber: 0,
      searchValues: forReq,
    };
  }

  /**
   * Constructs and returns an observable that will be used to get the selected values in the select
   * @param forReq the selected values in the select to be found
   */
  protected getSelectedItemsObs(forReq: any[]): Observable<any[]> {
    let obs: Observable<any[]>;
    if (isObservable(this.items)) {
      obs = this.items;
    } else if (this.loadDataFn) {
      obs = this.loadDataFn(this.getSelectedValuesObsParams(forReq));
    }

    // @ts-expect-error
    return isObservable(obs) ? obs : of(this.ngsItems);
  }

  /**
   * Collects found items and converted not found items together for the resulting output.
   * The display value of not found is taken from the `bindValue` field.
   * @param items found items
   * @param forReq items to look for
   */
  protected mapNotFoundItems(items: any[], forReq: any[]): Observable<any[]> {
    if (!this.bindValue || !this.bindLabel) return of(items);
    /** Find and convert not found items */
    const notFound = forReq
      .filter((searched) => !items.find((item) => item[this.bindValue!] === searched))
      .map((searched) => ({ [this.bindValue!]: searched, [this.bindLabel!]: searched }));
    /** Combine found and not found */
    return of(items.concat(notFound));
  }

  /**
   * Get selected values to display in select
   * @param value selected value(s)
   */
  protected getSelectedItems(value: any): Observable<any[]> {
    const forReq = this.getValuesForRequest(this.normalizeValue(value));
    if (!forReq.length) return of([]);
    return this.getSelectedItemsObs(forReq).pipe(
      mergeMap((items) => this.mapNotFoundItems(items, forReq)),
    );
  }

  /**
   * Setting the value and propagating the event
   * @param value value in select
   */
  protected setValue(value?: any): void {
    this.value = value;
    this.valueChanged.emit(value);
    this.hasValueStyle = this.hasValue();
  }

  /** Writes a new value to the element */
  // @ts-ignore
  public writeValue(value: any): void {
    this.setValue(value);
    this.resetState();
    this.selectedItemsSubs?.unsubscribe();
    this.selectedItemsSubs = this.getSelectedItems(value)
      .pipe(
        catchError((err) => {
          console.error(err);
          /** If there is an error, we assume that nothing was found */
          return of([]);
        }),
      )
      .pipe(this.takeUntilDestroy<any[]>())
      .subscribe((items) => {
        if (items.length) {
          this.ngsItems = (this.ngsItems || []).concat(items);
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  /**
   * Checks if the select contains a value.
   * Works as normal and in multiselect mode.
   */
  public hasValue(): boolean {
    if (Array.isArray(this.value)) return this.value.length > 0;
    return this.value !== null && this.value !== undefined;
  }

  /** Sets focus on the element */
  public focus(): void {
    this.ngSelect.focus();
  }

  /** Removes focus from the element */
  public blur(): void {
    this.ngSelect.blur();
  }

  /** Load elements asynchronously */
  protected loadItems(): void {
    this.itemsLoadSubs?.unsubscribe();
    this.loadDataParams.pageNumber += 1;

    let obs: Observable<any>;
    if (this.items && !isObservable(this.items)) {
      this.ngsItems = [...this.items];
      return;
    } else if (isObservable(this.items)) {
      obs = this.items;
    } else if (this.loadDataFn) {
      obs = this.loadDataFn(this.loadDataParams);
    }
    // @ts-expect-error
    if (!obs) return;

    this.loading = true;
    this.itemsLoadSubs = obs
      .pipe(
        catchError((err) => {
          console.error('An error occurred while retrieving data', err);
          return of([]);
        }),
      )
      .pipe(
        tap((items: any[]) => {
          /**
           * Everything that came in the new portion will be removed from the current items,
           * so that those who come stand as much as possible in the right place according to the sorting.
           * It will probably be more convenient for the selected items to be displayed on top,
           * then you will need to resolve issues sorting after deselection.
           */
          if (this.bindValue) {
            const newItems = this.ngsItems.filter(
              (ngItem) =>
                !items.find(
                  (item) => item[this.bindValue!] === ngItem[this.bindValue!],
                ),
            );
            if (newItems.length < this.ngsItems.length) {
              this.ngsItems = newItems;
            }
          } else if (this.compareWith) {
            const newItems = this.ngsItems.filter(
              (ngItem) => !items.find((item) => this.compareWith!(item, ngItem)),
            );
            if (newItems.length < this.ngsItems.length) {
              this.ngsItems = newItems;
            }
          }

          if (items.length) {
            this.ngsItems = (this.ngsItems || []).concat(items || []);
          }
          this.loading = false;
          this.itemsLoadSubs = null;
          this.changeDetectorRef.markForCheck();
        }),
      )
      .pipe(this.takeUntilDestroy<any[]>())
      .subscribe();
  }

  /** Casts a value to an array */
  protected normalizeValue(value: any): any[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (value !== null && value !== undefined) {
      return [value];
    }
    return [];
  }

  /** Disable custom search */
  protected disableCustomSearch(): void {
    this.typeahead?.complete();
  }

  /** Enable custom search */
  protected enableCustomSearch(): void {
    this.disableCustomSearch();
    this.typeahead = new Subject<string>();
    this.typeahead
      .pipe(debounceTime<string>(this.searchDebounce))
      .pipe(this.takeUntilDestroy<string>())
      .subscribe((term) => {
        if (typeof this.loadDataFn === 'function') {
          /** At the beginning of the search, save the items */
          if (!this.isSearch) {
            this.isSearch = true;
            this.beforeSearchNgItems = this.ngsItems;
          }
          this.loadDataParams.searchTerm = term;
          this.loadDataParams.pageNumber = -1;
          this.ngsItems = [];
          this.loadItems();
        }
      });
  }

  /** Reset the state of the component */
  public resetState(): void {
    this.itemsLoadSubs?.unsubscribe();
    this.ngSelect?.close();
    const values = this.normalizeValue(this.value);
    /** For the case of loading through a function or an observable, keep only selected items */
    if (isObservable(this.items) || this.loadDataFn) {
      if (this.bindValue && values.length) {
        this.ngsItems = this.ngsItems.filter((item) =>
          values.find((value) => item[this.bindValue!] === value),
        );
      } else if (this.compareWith) {
        this.ngsItems = this.ngsItems.filter((item) =>
          values.find((value) => this.compareWith!(item, value)),
        );
      } else {
        this.ngsItems = values;
      }
    }
    this.loadDataParams.pageNumber = -1;
    this.changeDetectorRef.markForCheck();
  }

  /** Clear state, loaded items and reset selected values */
  public clear(): void {
    this.setValue();
    this.resetState();
  }

  /** Fires when the `ng-select` element is clicked */
  public onMouseDown(event: MouseEvent): void {
    const hasClickedOnDropdown = event
      .composedPath()
      .some((element) => (element as HTMLElement)?.tagName === 'NG-DROPDOWN-PANEL');

    if (hasClickedOnDropdown) {
      // this.ngSelect.searchTerm = '';
    }

    if (!this.openOnClick && !hasClickedOnDropdown) {
      this.ngSelect.close();
    }
    // this.changeDetectorRef.markForCheck()
  }

  /** Fires when the add value */
  public addEvent(value: any) {
    this.add.emit(value);
  }

  public open() {
    this.ngSelect.open();
  }

  public clearFromValue(val: string) {
    this.value = this.value.filter((item: any) => item !== val);
    this.setValue(this.value);
    this.writeValue(this.value);
    this.onChange(this.value);
    this.changeDetectorRef.markForCheck();
  }

  public handleClearValue() {
    this.ngSelect.handleClearClick();
  }
}
