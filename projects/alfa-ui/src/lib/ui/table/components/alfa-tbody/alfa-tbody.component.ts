import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    QueryList,
    ViewEncapsulation,
} from '@angular/core';
import { startWith } from 'rxjs/operators';

import { AlfaTableService } from '../../services/alfa-table.service';
import { AlfaTrComponent } from '../alfa-tr/alfa-tr.component';

/**
 * Body for {@link AlfaTableComponent}.
 * Implements indexing of strings, definition of strings for display.
 */
@Component({
    selector: 'alfa-tbody',
    templateUrl: './alfa-tbody.component.html',
    styleUrls: ['./alfa-tbody.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-tbody',
    },
})
export class AlfaTbodyComponent implements AfterContentInit {
    /** References to Rows Components */
    @ContentChildren(AlfaTrComponent) public rows!: QueryList<AlfaTrComponent>;

    /** @ignore */
    constructor(public service: AlfaTableService) {}

    /** @ignore */
    public ngAfterContentInit(): void {
        /**
         * Subscribe to `changes` in the lines in the content in order to put down their index relative to the main array of lines.
         * `startWith(0)` means that you need to immediately execute the function in the subscription.
         */
        this.rows.changes.pipe(startWith(0)).subscribe(() => {
            this.rows.forEach((row, index) => {
                row.index = index;
            });
        });
    }
}
