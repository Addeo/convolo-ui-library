import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutsComponent} from "./layouts.component";
import {LayoutsRoutingModule} from "./layouts-routing.module";



@NgModule({
  declarations: [
    LayoutsComponent
  ],
  imports: [
    CommonModule,
    LayoutsRoutingModule
  ],
  exports: [
    LayoutsComponent
  ]
})
export class LayoutsModule { }
