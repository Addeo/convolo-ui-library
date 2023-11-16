import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AlfaErrorComponent } from './alfa-error.component';
import { AlfaErrorDefaultConfig } from './alfa-error.config';
import { AlfaErrorService } from './alfa-error.service';
import { Alfa_ERROR_CONFIG, Alfa_ERROR_DEFAULT_CONFIG } from './alfa-error.tokens';
import { AlfaErrorConfig } from './alfa-error.types';

@NgModule({
    imports: [CommonModule],
    declarations: [AlfaErrorComponent],
    providers: [
        {
            provide: Alfa_ERROR_DEFAULT_CONFIG,
            useValue: AlfaErrorDefaultConfig,
        },
        AlfaErrorService,
    ],
    exports: [AlfaErrorComponent],
})
export class AlfaErrorModule {
    public static forRoot(
        config: Partial<AlfaErrorConfig> = {},
    ): ModuleWithProviders<AlfaErrorModule> {
        return {
            ngModule: AlfaErrorModule,
            providers: [
                {
                    provide: Alfa_ERROR_CONFIG,
                    useValue: config,
                },
            ],
        };
    }
}
