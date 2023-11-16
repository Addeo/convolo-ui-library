import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlfaDirectivesModule } from '../../directives/alfa-directives.module';
import { AlfaModalComponent } from './alfa-modal.component';
import { AlfaModalGlobalConfig } from './alfa-modal.interface';
import { ALFA_MODAL_CONFIG } from './tokens';
import { AlfaButtonDirective } from '../alfa-button';

@NgModule({
  imports: [CommonModule, AlfaDirectivesModule, AlfaButtonDirective],
    declarations: [AlfaModalComponent],
    exports: [AlfaModalComponent],
})
export class AlfaModalModule {
    static forRoot(config: Partial<AlfaModalGlobalConfig>): ModuleWithProviders<AlfaModalModule> {
        return {
            ngModule: AlfaModalModule,
            providers: [
                {
                    provide: ALFA_MODAL_CONFIG,
                    useValue: config,
                },
            ],
        };
    }
}
