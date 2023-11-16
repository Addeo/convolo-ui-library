import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Component to display in {@link AlfaTableComponent} when state is `loaded` and there are no items.
 */
@Component({
    selector: 'alfa-no-data',
    templateUrl: './alfa-no-data.component.html',
    styleUrls: ['./alfa-no-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-no-data',
    },
})
export class AlfaNoDataComponent {
    @Input() public chosenInterval: { dateRangeStart: Date; dateRangeEnd: Date } | null = null;
}
