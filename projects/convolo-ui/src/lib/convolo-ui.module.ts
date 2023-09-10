import { NgModule } from '@angular/core';
import { ConvoloUiComponent } from './convolo-ui.component';
import { FormsModule } from "./ui/forms/forms.module";



@NgModule({
  declarations: [
    ConvoloUiComponent,
  ],
  imports: [
    FormsModule
  ],
  exports: [
    ConvoloUiComponent,
    FormsModule
  ]
})
export class ConvoloUiModule { }
