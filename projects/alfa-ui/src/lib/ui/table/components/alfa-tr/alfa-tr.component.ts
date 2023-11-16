import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    EventEmitter,
    Output,
    QueryList,
    ViewEncapsulation,
} from '@angular/core';
import { filter, startWith } from 'rxjs/operators';

import { AlfaTableRecord, AlfaTableSelected } from '../../interface/record';
import { AlfaTableService } from '../../services/alfa-table.service';
import { AlfaThComponent } from '../alfa-th/alfa-th.component';
import { AlfaTdComponent } from '../alfa-td/alfa-td.component';
import { BaseComponent } from '../../../base-component/base-component.component';

/**
 * Row for {@link AlfaTbodyComponent}.
 * Implements cell management, assigns an indexes to them.
 */
@Component({
    selector: 'alfa-tr',
    templateUrl: './alfa-tr.component.html',
    styleUrls: ['./alfa-tr.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-tr',
    },
})
export class AlfaTrComponent<T extends Record<any, any> = AlfaTableRecord>
    extends BaseComponent
    implements AfterContentInit
{
    /** Row index in string array */
    public index!: number;
    /** Selection flag setter */
    public set isSelected(value: boolean) {
        this.internalIsSelected = value;
    }

    /** Selection flag */
    private internalIsSelected = false;
    /** Row selection event */
    @Output() public selected = new EventEmitter<AlfaTableSelected<T>>();
    /** Cell (td) array reference in content */
    @ContentChildren(AlfaTdComponent) public cells!: QueryList<AlfaTdComponent>;
    /** Cell (th) array references in ng-content */
    @ContentChildren(AlfaThComponent) public headerCells!: QueryList<AlfaThComponent>;

    /** @ignore */
    constructor(private readonly service: AlfaTableService<T>) {
        super();

        this.service.rowSelected
            .on()
            .pipe(filter((event) => event.index === this.index))
            .pipe(this.takeUntilDestroy())
            .subscribe((event) => {
                this.isSelected = event.isSelected;
                this.selected.emit({ index: this.index, rec: this.service.data[this.index]! });
            });
    }

    /** @ignore */
    public ngAfterContentInit(): void {
        /**
         * Set indexes to the cells (th) in the case when they change.
         * `startWith(0)` means that during initialization we immediately start indexing.
         */
        this.headerCells.changes
            .pipe(startWith(0))
            .pipe(this.takeUntilDestroy())
            .subscribe(() => {
                this.headerCells.forEach((cell, index) => {
                    cell.index = index;
                });
            });

        /** Set the cells (td) indexes */
        this.cells.changes
            .pipe(startWith(0))
            .pipe(this.takeUntilDestroy())
            .subscribe(() => {
                this.cells.forEach((cell, index) => {
                    cell.index = index;
                });
            });
    }
}
