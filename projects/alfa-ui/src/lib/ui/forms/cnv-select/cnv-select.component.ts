import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'cnv-select',
  templateUrl: './cnv-select.component.html',
  styleUrls: ['./cnv-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // host: {
  //   class: 'cnv-select',
  // },
  // standalone: true,
  // imports: [
  //   NgSelectModule
  // ],
})
export class CnvSelectComponent {

}
