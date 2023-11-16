import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
    ViewEncapsulation,
} from '@angular/core';

/**
 * Component to display in {@link AlfaTableComponent} when state is `error`.
 */
@Component({
    selector: 'alfa-error-state',
    templateUrl: './alfa-error-state.component.html',
    styleUrls: ['./alfa-error-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-error-state',
    },
})
export class AlfaErrorStateComponent {
    @Output() public clickRefresh = new EventEmitter<void>();

    public refresh(): void {
        this.clickRefresh.emit();
    }
}
