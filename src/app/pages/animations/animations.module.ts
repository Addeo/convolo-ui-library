import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnimationsComponent} from "./animations.component";
import { ScrubComponent } from './scrub/scrub.component';
import {AnimationsRoutingModule} from "./animations-routing.module";



@NgModule({
  declarations: [
    AnimationsComponent,
    ScrubComponent
  ],
  imports: [
    CommonModule,
    AnimationsRoutingModule
  ]
})
export class AnimationsModule { }
