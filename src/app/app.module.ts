import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AlfaUiModule} from "../../projects/alfa-ui/src/lib/alfa-ui.module";
import { HeadersComponent } from './pages/headers/headers.component';
import { LayoutsComponent } from './pages/layouts/layouts.component';
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AlfaUiModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
