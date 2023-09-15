import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PagesComponent} from "./pages.component";
import {RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {PagesRoutingModule} from "./pages-routing.module";
import {ConvoloUiModule} from "../../../projects/convolo-ui/src/lib/convolo-ui.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    ReactiveFormsModule,
    RouterOutlet,
    PagesRoutingModule,
    ConvoloUiModule
  ],
    declarations: [
        PagesComponent,
    ],
    exports: [

    ],
    providers: [],
})
export class PagesModule {}
