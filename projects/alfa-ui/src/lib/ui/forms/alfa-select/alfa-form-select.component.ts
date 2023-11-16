import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'alfa-form-select',
    templateUrl: './alfa-form-select.component.html',
    styleUrls: ['./alfa-form-select.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    // host: {
    //   class: 'alfa-select',
    // },
    // standalone: true,
    // imports: [
    //   NgSelectModule
    // ],
})
export class AlfaFormSelectComponent {}
