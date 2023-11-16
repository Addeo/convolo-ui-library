import {
    Attribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';

import {
    AlfaTableDataFn,
    AlfaTableMode,
    AlfaTableRecord,
    AlfaTableRowSelectedEvent,
    AlfaTableRowSelectedOutputEvent,
    AlfaTableSelected,
    AlfaTableSort,
    AlfaTableState,
} from '../../interface';
import { AlfaTableService } from '../../services/alfa-table.service';
import { BaseComponent } from '../../../base-component/base-component.component';

@Component({
    selector: 'alfa-table',
    templateUrl: './alfa-table.component.html',
    styleUrls: ['./alfa-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [AlfaTableService],
    host: {
        class: 'alfa-table',
    },
})
export class AlfaTableComponent<T extends Record<any, any> = AlfaTableRecord>
    extends BaseComponent
    implements OnChanges, OnInit
{
    /** Option show alfa-no-data */
    @Input() public isShowNoData = true;

    /** Filter Interval, used with no-data componentn */
    @Input() public chosedInterval: { dateRangeStart: Date; dateRangeEnd: Date } | null = null;

    /** Array of objects to display in the table */
    @Input()
    public set data(value: T[]) {
        this.service.data = value;
    }

    /** Function to get records for the grid */
    @Input()
    public set dataFn(value: AlfaTableDataFn<T>) {
        this.service.dataFn = value;
    }

    /** Page size in rows */
    @Input()
    public set pageSize(value: number) {
        this.service.pageSize = value;
    }

    /** Default sort */
    @Input()
    public set sort(value: AlfaTableSort) {
        this.service.sort = value;
    }

    /** Rows border */
    @Input() public border = false;

    /** Table mode setter */
    public set mode(value: AlfaTableMode) {
        this.service.mode = value;
    }

    /** Table mode getter */
    public get mode(): AlfaTableMode {
        return this.service.mode;
    }

    /** State change event */
    @Output() public state = new EventEmitter<AlfaTableState>();
    /** Table record selection event */
    @Output() public rowSelected = new EventEmitter<AlfaTableRowSelectedOutputEvent<T>>();
    /** Row select event */
    @Output() public rowSelect = new EventEmitter<AlfaTableSelected<T>>();

    /** @ignore */
    @HostBinding('class') public classes = '';

    /** Array of rows that ngFor should rely on */
    public items!: T[];

    /** @ignore */
    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public service: AlfaTableService<T>,
        @Attribute('mode') private attrMode?: AlfaTableMode,
    ) {
        super();

        if (this.attrMode) {
            this.mode = this.attrMode;
        }

        this.service.state.on().subscribe((state) => this.state.emit(state));

        this.service.rowSelect
            .on()
            .pipe(this.takeUntilDestroy())
            .subscribe((event) => this.rowSelect.emit({ index: event.index, rec: event.rec }));

        this.service.rowSelected
            .on()
            .pipe(this.takeUntilDestroy<AlfaTableRowSelectedEvent>())
            .subscribe((event: AlfaTableRowSelectedEvent) =>
                this.rowSelected.emit({
                    ...event,
                    rec: this.service.data[event.index]!,
                }),
            );

        this.service.changeData.on().subscribe((data: T[]) => {
            this.items = data;
            this.changeDetectorRef.markForCheck();
        });
    }

    /** @ignore */
    public ngOnChanges(changes: SimpleChanges): void {
        //@ts-ignore
        if (changes.data || changes.dataFn) {
            this.service.loadData();
        }
    }

    /** @ignore */
    public ngOnInit(): void {
        this.applyClasses();
    }

    private applyClasses(): void {
        this.classes = `
        alfa-table_mode_${this.mode}
        ${this.border ? 'alfa-table_border' : ''}
      `;
    }

    public refresh(): void {
        this.service.loadData();
    }
}
