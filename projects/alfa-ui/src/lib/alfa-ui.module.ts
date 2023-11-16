import { NgModule } from '@angular/core';
import { AlfaUiComponent } from './alfa-ui.component';
import { FormsModule } from "./ui/forms/forms.module";
import {AlfaErrorModule} from "./ui/alfa-error";
import {BaseComponent} from "./ui/base-component/base-component.component";
import {AlfaTableModule} from "./ui/table/alfa-table.module";
import {LayoutsModule} from "./ui/layouts/layouts.module";
import {AlfaUploadComponent} from "./ui/alfa-upload";
import {AlfaToasterComponent} from "./ui/alfa-toaster/alfa-toaster.component";
import {AlfaTabsModule} from "./ui/alfa-tabs";
import {AlfaSelectComponent} from "./ui/alfa-select/alfa-select.component";
import {AlfaProgressComponent} from "./ui/alfa-progress";
import {AlfaPreviewComponent} from "./ui/alfa-preview-2/alfa-preview.component";
import {AlfaModalModule} from "./ui/alfa-modal";
import {AlfaMaskModule} from "./ui/alfa-mask";
import {AlfaInputComponent} from "./ui/alfa-input/alfa-input.component";
import {AlfaCheckboxComponent} from "./ui/alfa-checkbox/alfa-checkbox.component";
import {AlfaButtonDirective} from "./ui/alfa-button";
import {AlfaAbstractFormControl} from "./ui/abstract-control";
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AlfaUiComponent,
  ],
  imports: [
    FormsModule,
    AlfaErrorModule,
    BaseComponent,
    AlfaTableModule,
    LayoutsModule,
    AlfaUploadComponent,
    AlfaToasterComponent,
    AlfaTabsModule,
    AlfaSelectComponent,
    AlfaProgressComponent,
    AlfaPreviewComponent,
    AlfaModalModule,
    AlfaMaskModule,
    AlfaInputComponent,
    AlfaCheckboxComponent,
    AlfaButtonDirective,
    AlfaAbstractFormControl,
    NgSelectModule
  ],
  exports: [
    AlfaUiComponent,
    FormsModule,
    AlfaErrorModule,
    BaseComponent,
    AlfaTableModule,
    LayoutsModule,
    AlfaUploadComponent,
    AlfaToasterComponent,
    AlfaTabsModule,
    AlfaSelectComponent,
    AlfaProgressComponent,
    AlfaPreviewComponent,
    AlfaModalModule,
    AlfaMaskModule,
    AlfaInputComponent,
    AlfaCheckboxComponent,
    AlfaButtonDirective,
    AlfaAbstractFormControl
  ]
})
export class AlfaUiModule { }
