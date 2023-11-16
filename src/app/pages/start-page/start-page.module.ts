import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartPageComponent } from './start-page.component';
import {FormsModule} from "alfa-ui";



@NgModule({
  declarations: [
    StartPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class StartPageModule { }
