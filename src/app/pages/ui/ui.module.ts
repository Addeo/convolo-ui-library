import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiComponent } from './ui.component';
import {AlfaUiModule} from "alfa-ui";

@NgModule({
  declarations: [
    UiComponent
  ],
  imports: [
    // CommonModule,
    AlfaUiModule
  ]
})
export class UiModule { }
