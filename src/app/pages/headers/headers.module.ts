import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeadersComponent} from "./headers.component";



@NgModule({
  declarations: [
    HeadersComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    HeadersComponent
  ]
})
export class HeadersModule { }
