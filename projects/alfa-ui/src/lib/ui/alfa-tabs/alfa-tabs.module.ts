import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlfaTabComponent } from './components/alfa-tab/alfa-tab.component';
import { AlfaTabsComponent } from './components/alfa-tabs/alfa-tabs.component';

@NgModule({
    imports: [CommonModule],
    declarations: [AlfaTabComponent, AlfaTabsComponent],
    exports: [AlfaTabComponent, AlfaTabsComponent],
})
export class AlfaTabsModule {}
