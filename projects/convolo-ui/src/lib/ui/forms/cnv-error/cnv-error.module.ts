import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CnvErrorComponent } from './cnv-error.component';
import { cnvErrorDefaultConfig } from './cnv-error.config';
import { CnvErrorService } from './cnv-error.service';
import { CNV_ERROR_CONFIG, CNV_ERROR_DEFAULT_CONFIG } from './cnv-error.tokens';
import { CnvErrorConfig } from './cnv-error.types';

@NgModule({
    imports: [CommonModule],
    declarations: [CnvErrorComponent],
    providers: [
        {
            provide: CNV_ERROR_DEFAULT_CONFIG,
            useValue: cnvErrorDefaultConfig,
        },
        CnvErrorService,
    ],
    exports: [CnvErrorComponent],
})
export class CnvErrorModule {
    public static forRoot(
        config: Partial<CnvErrorConfig> = {},
    ): ModuleWithProviders<CnvErrorModule> {
        return {
            ngModule: CnvErrorModule,
            providers: [
                {
                    provide: CNV_ERROR_CONFIG,
                    useValue: config,
                },
            ],
        };
    }
}
