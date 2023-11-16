import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'alfa-select',
  templateUrl: './alfa-select.component.html',
  styleUrls: ['./alfa-select.component.scss'],
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
export class AlfaSelectComponent {

}
