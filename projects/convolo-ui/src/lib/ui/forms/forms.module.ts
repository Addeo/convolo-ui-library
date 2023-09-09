import { NgModule } from '@angular/core';
import { CnvInputComponent } from './cnv-input/cnv-input.component';
import { CnvSelectComponent } from './cnv-select/cnv-select.component';
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [
    CnvInputComponent,
    CnvSelectComponent
  ],
  imports: [
    NgSelectModule
  ],
  exports: [
    CnvInputComponent
  ]
})
export class FormsModule { }
