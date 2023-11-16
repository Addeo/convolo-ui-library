import { Injectable, OnDestroy } from '@angular/core';
import { first, isObservable, Observable, of, Subject, Subscription } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';

import {
    AlfaTableAfterLoadFn,
    AlfaTableChangeCellSizeEvent,
    AlfaTableDataFn,
    AlfaTableMode,
    AlfaTableRecord,
    AlfaTableRowSelectedEvent,
    AlfaTableSelected,
    AlfaTableSort,
    AlfaTableSortFn,
    AlfaTableSortOrder,
    AlfaTableSortOrderEvent,
    AlfaTableState,
} from '../interface';
import { ReactiveProperty } from './reactive-property';

/**
 * A service that manages the components that make up the {@link AlfaTableComponent}.
 * Each `alfa-table` has its own service instance. All components placed in `alfa-table` ng-content
 * and service injectors get the instance that belongs to the current `alfa-table`. Accordingly, it is possible
 * write your own implementations of certain components that form `alfa-table`, subscribe to events in the service
 * and implement the missing logic.
 */
@Injectable()
export class AlfaTableService<T extends Record<any, any> = AlfaTableRecord> implements OnDestroy {
    /** Rows array setter */
    public set data(value: T[]) {
        this.internalData = value;
    }

    /** Rows array getter */
    public get data(): T[] {
        return this.internalData;
    }

    /** Records load function setter */
    public set dataFn(value: AlfaTableDataFn<T>) {
        this.internalDataFn = value;
    }

    /** Sort setter */
    public set sort(value: AlfaTableSort | undefined) {
        this.internalSort = value;
    }

    /** Sort getter */
    public get sort(): AlfaTableSort | undefined {
        return this.internalSort;
    }

    /** Display table mode setter */
    public set mode(value: AlfaTableMode) {
        this.internalMode = value;
    }

    /** Display table mode getter */
    public get mode(): AlfaTableMode {
        return this.internalMode;
    }

    /** Array of strings that the table is based on */
    private internalData: T[] = [];
    /** Function for getting table data */
    private internalDataFn: AlfaTableDataFn<T> | undefined;
    /** Initial array of strings, stores initial order */
    private initialData: T[] = [];
    /** Current sort settings */
    private internalSort: AlfaTableSort | undefined;
    /** Display table mode */
    public internalMode: AlfaTableMode = 'flex';

    /** Table page size */
    public pageSize = 20;
    /** Function to compare values for sorting */
    public compareSortFn: AlfaTableSortFn | undefined;
    /** Records post-processing function */
    public afterLoadFn: AlfaTableAfterLoadFn<T> | undefined;

    /** Sort order */
    public sortOrder = new ReactiveProperty<AlfaTableSortOrderEvent>();
    /** Data in the table */
    public changeData = new ReactiveProperty<T[]>();
    /** Cell size */
    public cellSize = new ReactiveProperty<AlfaTableChangeCellSizeEvent>();
    /** Table state */
    public state = new ReactiveProperty<AlfaTableState>();
    /** Select row */
    public rowSelect = new ReactiveProperty<AlfaTableSelected<T>>();
    /** Selected row for external notification */
    public rowSelected = new ReactiveProperty<AlfaTableRowSelectedEvent>();

    /** Unsubscriber */
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    /** Cell sizes by index */
    private colSizesByIndex = new Map<number, string | undefined>();
    /** Subscription to query data in the table */
    private loadDataFnSubscription: Subscription | undefined;
    /** Subscription to sort data in the table */
    private sortOrderSubscription: Subscription | undefined;
    /** Current page */
    private page = 0;
    /** Size of the last portion of requested data */
    private lastCount = -1;
    /** Selected rows */
    private selectedRows = new Map<number, AlfaTableSelected<T>>();

    /** @ignore */
    constructor() {
        this.cellSize
            .on()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((value) => this.colSizesByIndex.set(value.index, value.width));

        this.subscribeToRowSelect();
    }

    /** @ignore */
    public ngOnDestroy(): void {
        // @ts-expect-error
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * Returns the cell size by index
     * @param index Cell size
     */
    public getColSize(index: number): string | undefined {
        return this.colSizesByIndex.get(index);
    }

    /**
     * Loads data into a table
     */
    public loadData(): void {
        this.state.emit(AlfaTableState.loading);
        this.sortOrderSubscription?.unsubscribe();
        this.loadDataFnSubscription?.unsubscribe();
        /** Loading via function */
        if (this.internalDataFn) {
            this.page = 0;
            this.lastCount = -1;
            this.changeData.emit((this.internalData = []));
            this.loadDataFnSubscription = this.loadDataFn(
                this.page,
                this.pageSize,
                this.internalSort,
            )
                .pipe(
                    tap(
                        () =>
                            (this.sortOrderSubscription = this.sortOrder
                                .on()
                                .pipe(first())
                                .pipe(takeUntil(this.ngUnsubscribe))
                                .subscribe((sort) => {
                                    this.internalSort = {
                                        field: sort.field,
                                        order: sort.sortOrder,
                                    };
                                    this.loadData();
                                })),
                    ),
                )
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                    error: () => this.state.emit(AlfaTableState.error),
                });
        } else if (this.internalData) {
            /** Loading via setting values */
            this.changeData.emit(this.internalData);
            this.state.emit(AlfaTableState.loaded);
            this.sortOrderSubscription = this.sortOrder
                .on()
                .pipe(first())
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((sort) => {
                    this.internalSort = {
                        field: sort.field,
                        order: sort.sortOrder,
                    };
                    this.sortData();
                    this.changeData.emit(this.internalData);
                    this.loadData();
                });
        }
    }

    /**
     * Gets a piece of data into a table.
     * On a successful request, sets the `loaded` state. On error — `error`.
     * @param page page number
     * @param size page size
     * @param sort sorting
     */
    private loadDataFn(page: number, size: number, sort?: AlfaTableSort): Observable<T[]> {
        return this.internalDataFn!({ sort, page, size })
            .pipe(mergeMap((recs) => this.afterLoad(recs)))
            .pipe(
                tap((res) => {
                    this.lastCount = res.length;
                    this.internalData = [...this.data, ...res];
                    this.changeData.emit(this.internalData);
                    this.state.emit(AlfaTableState.loaded);
                }),
            );
    }

    /**
     * Calls the `afterLoadFn` callback, if present.
     * If the callback is not configured, it returns the original data without modifications.
     * @param recs incoming table records
     */
    private afterLoad(recs: T[]): Observable<T[]> {
        if (this.afterLoadFn) {
            const modified = this.afterLoadFn.apply(null, [recs]);
            if (isObservable(modified)) {
                return modified as Observable<T[]>;
            }
            return of(modified);
        }
        return of(recs);
    }

    /** Data sorting method */
    private sortData(): void {
        this.internalData = [...this.initialData];

        if (this.internalSort === undefined || Array.isArray(this.internalSort)) return;

        if (
            this.internalSort.field &&
            (this.internalSort.order ?? AlfaTableSortOrder.NONE) !== AlfaTableSortOrder.NONE
        ) {
            const sortFn = this.compareSortFn ?? this.defaultCompareSortFn;
            this.internalData.sort((item1, item2) => {
                const internalSort = this.internalSort as AlfaTableSort;
                const val1 = item1[internalSort.field];
                const val2 = item2[internalSort.field];
                return sortFn.apply(null, [val1, val2, internalSort.order]);
            });
        }
    }

    /** Default value comparison function for sorting */
    private defaultCompareSortFn(val1: T, val2: T, order: AlfaTableSortOrder): number {
        const coefficient = order === AlfaTableSortOrder.ASC ? 1 : -1;
        if (val1 < val2) {
            return -1 * coefficient;
        } else if (val1 > val2) {
            return 1 * coefficient;
        }
        return 0;
    }

    /** Checks if a row is selected or not */
    public isRowSelected(index: number): boolean {
        return this.selectedRows.has(index);
    }

    /** Returns selected rows */
    public getSelectedRows(): AlfaTableSelected<T>[] {
        return Array.from(this.selectedRows.values()).map((item) => ({ ...item }));
    }

    /** Method for selecting rows */
    public setSelection(rowIndex: number | number[]): void {
        const indexes = Array.isArray(rowIndex) ? rowIndex : [rowIndex];

        indexes.forEach((index) => {
            if (this.selectedRows.get(index)) {
                this.deleteSelectedRow(index);
            } else {
                this.setSelectedRow(index);
            }
        });
    }

    /** Method for deselecting rows */
    public deselectAll(): void {
        this.selectedRows.forEach((_, index) => {
            this.deleteSelectedRow(index);
        });
    }

    /** Method for selecting rows */
    public selectAll(): void {
        this.internalData.forEach((_, index) => {
            this.setSelectedRow(index);
        });
    }

    /** Method for selecting a row */
    private setSelectedRow(index: number): void {
        this.selectedRows.set(index, { index, rec: this.data[index]! });
        this.rowSelected.emit({ index, isSelected: true });
    }

    /** Method for deselecting a row */
    private deleteSelectedRow(index: number): void {
        this.selectedRows.delete(index);
        this.rowSelected.emit({ index, isSelected: false });
    }

    /** Subscribing to a click on a row */
    private subscribeToRowSelect(): void {
        this.rowSelect
            .on()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((value) => {
                this.setSelection(value.index);
            });
    }
}
