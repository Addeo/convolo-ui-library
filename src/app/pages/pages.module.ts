import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PagesComponent} from "./pages.component";
import {RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {PagesRoutingModule} from "./pages-routing.module";
import {AlfaUiModule} from "../../../projects/alfa-ui/src/lib/alfa-ui.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    ReactiveFormsModule,
    RouterOutlet,
    PagesRoutingModule,
    AlfaUiModule
  ],
    declarations: [
        PagesComponent,
    ],
    exports: [

    ],
    providers: [],
})
export class PagesModule {}
