import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { filter } from 'rxjs/operators';

import { AlfaTableService } from '../../services/alfa-table.service';
import { AlfaTableSortOrder } from '../../interface/sort';
import { AlfaTableState } from '../../interface/states';
import { AlfaTableSortOrderEvent } from '../../interface';

/**
 * The component implements a cell in the header for the {@link AlfaTheadComponent} component.
 * Sets the width of all cells.
 */
@Component({
    selector: 'alfa-th',
    templateUrl: './alfa-th.component.html',
    styleUrls: ['./alfa-th.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-th',
    },
})
export class AlfaThComponent implements OnInit {
    /**
     * Cell index setter. Set index, width and emit width change
     * (for initial cell initialization)
     */
    public set index(value: number) {
        this.internalIndex = value;
        this.service.cellSize.emit({
            width: this.internalWidth,
            index: this.internalIndex,
        });
    }

    /** Cell index setter */
    public get index(): number {
        return this.internalIndex;
    }

    /** Cell index */
    private internalIndex!: number;
    /** Cell width */
    private internalWidth: string | undefined;

    /**
     * Cell width setter (CSS-valid string).
     * You can pass a string without units or a number, in which case it will be converted to pixels.
     */
    @Input()
    public set width(value: string | number | undefined) {
        let width: string | undefined;

        if (value === undefined) {
            width = value;
        } else {
            width =
                typeof value === 'number' || value.match(/^\d+$/) !== null ? `${value}px` : value;
        }

        this.internalWidth = width;
        this.setWidth();
    }

    /** Cell width getter */
    public get width(): string | number | undefined {
        return this.internalWidth;
    }

    /** Sort state setter */
    public set sortOrder(value: AlfaTableSortOrder) {
        this.innerSortOrder = value;
        this.sortedAsc = this.innerSortOrder === AlfaTableSortOrder.ASC;
        this.sortedDesc = this.innerSortOrder === AlfaTableSortOrder.DESC;
    }

    /** Sort state getter */
    public get sortOrder(): AlfaTableSortOrder {
        return this.innerSortOrder;
    }

    /** Sort state */
    private innerSortOrder = AlfaTableSortOrder.NONE;

    /** Field name (key from object with string entry) */
    @Input() public field!: string;

    /** Having a sort */
    @Input() public sortable = false;

    /** Having a sort */
    @Input() public sortableManual = false;

    /** Is checkbox column */
    @Input() public checkbox = false;

    @Output() sortOrderChange = new EventEmitter<AlfaTableSortOrderEvent>();

    @HostBinding('class.alfa-th_sorted_asc') public sortedAsc = false;
    @HostBinding('class.alfa-th_sorted_desc') public sortedDesc = false;

    /** @ignore */
    constructor(
        private readonly service: AlfaTableService,
        private readonly element: ElementRef<HTMLElement>,
    ) {}

    /** @ignore */
    public ngOnInit(): void {
        if (
            this.service.sort !== undefined &&
            !Array.isArray(this.service.sort) &&
            this.service.sort.field === this.field
        ) {
            this.sortOrder = this.service.sort.order;
        }

        /** Reset sort if another column is sorted */
        this.service.sortOrder
            .on()
            .pipe(filter((sort) => sort.index !== this.index))
            .subscribe(() => {
                this.sortOrder = AlfaTableSortOrder.NONE;
            });
    }

    /** Method for sorting data */
    public sort(): void {
        if (this.sortableManual) {
            this.sortOrder = this.innerSortOrder === 0 ? 2 : this.innerSortOrder - 1;
            this.sortOrderChange.emit({
                index: this.index,
                sortOrder: this.innerSortOrder,
                field: this.field,
            });
        }

        if (this.sortable && this.service.state.current === AlfaTableState.loaded) {
            if (this.index < 0) {
                console.warn('alfa-table: unknown index for sort');
                return;
            }
            if (!this.field) {
                console.warn('alfa-table: unknown field for sort');
                return;
            }
            this.sortOrder = this.innerSortOrder === 0 ? 2 : this.innerSortOrder - 1;
            this.service.sortOrder.emit({
                index: this.index,
                sortOrder: this.innerSortOrder,
                field: this.field,
            });
        }
    }

    /** Set cell width */
    private setWidth(): void {
        this.element.nativeElement.removeAttribute('style');

        if (this.width === undefined) {
            this.service.cellSize.emit({
                width: this.width,
                index: this.internalIndex,
            });

            return;
        }

        const width = this.width as string;

        if (this.service.mode === 'flex') {
            this.element.nativeElement.style.flexGrow = '0';
            this.element.nativeElement.style.flexShrink = '0';
            /** `width` will be ignored in this case, so an explicit `flex-basis` is used */
            this.element.nativeElement.style.flexBasis = width;
        } else {
            this.element.nativeElement.style.width = width;
        }

        if (this.internalIndex >= 0) {
            this.service.cellSize.emit({
                width,
                index: this.internalIndex,
            });
        }
    }
}
