import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlfaNoDataComponent } from './components/alfa-no-data/alfa-no-data.component';
import { AlfaErrorStateComponent } from './components/alfa-error-state/alfa-error-state.component';
import { AlfaTableActionsComponent } from './components/alfa-table-actions/alfa-table-actions.component';
import { AlfaTableComponent } from './components/alfa-table/alfa-table.component';
import { AlfaTbodyComponent } from './components/alfa-tbody/alfa-tbody.component';
import { AlfaTdComponent } from './components/alfa-td/alfa-td.component';
import { AlfaThComponent } from './components/alfa-th/alfa-th.component';
import { AlfaTheadComponent } from './components/alfa-thead/alfa-thead.component';
import { AlfaTrComponent } from './components/alfa-tr/alfa-tr.component';
import { AlfaButtonDirective } from '../alfa-button';

@NgModule({
  imports: [CommonModule, AlfaButtonDirective],
    declarations: [
        AlfaErrorStateComponent,
        AlfaNoDataComponent,
        AlfaTableActionsComponent,
        AlfaTableComponent,
        AlfaTbodyComponent,
        AlfaTdComponent,
        AlfaThComponent,
        AlfaTheadComponent,
        AlfaTrComponent,
    ],
    exports: [
        AlfaErrorStateComponent,
        AlfaNoDataComponent,
        AlfaTableActionsComponent,
        AlfaTableComponent,
        AlfaTbodyComponent,
        AlfaTdComponent,
        AlfaThComponent,
        AlfaTheadComponent,
        AlfaTrComponent,
    ],
})
export class AlfaTableModule {}
