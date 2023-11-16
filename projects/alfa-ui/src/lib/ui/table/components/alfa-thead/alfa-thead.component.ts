import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Header for {@link AlfaTableComponent}.
 */
@Component({
    selector: 'alfa-thead',
    templateUrl: './alfa-thead.component.html',
    styleUrls: ['./alfa-thead.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-thead',
    },
})
export class AlfaTheadComponent {}
