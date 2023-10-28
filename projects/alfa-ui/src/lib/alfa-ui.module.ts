import { NgModule } from '@angular/core';
import { AlfaUiComponent } from './alfa-ui.component';
import { FormsModule } from "./ui/forms/forms.module";



@NgModule({
  declarations: [
    AlfaUiComponent,
  ],
  imports: [
    FormsModule
  ],
  exports: [
    AlfaUiComponent,
    FormsModule
  ]
})
export class AlfaUiModule { }
