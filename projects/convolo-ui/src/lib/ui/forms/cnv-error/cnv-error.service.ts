import { Inject, Injectable, Optional } from '@angular/core';

import { CNV_ERROR_CONFIG, CNV_ERROR_DEFAULT_CONFIG } from './cnv-error.tokens';
import { CnvErrorConfig } from './cnv-error.types';

/**
 * Service for error configuration.
 */
@Injectable({
    providedIn: 'root',
})
export class CnvErrorService {
    /** Resulting error config. */
    private readonly mergedConfig: CnvErrorConfig;

    /** @ignore */
    constructor(
        @Inject(CNV_ERROR_DEFAULT_CONFIG) defaultConfig: CnvErrorConfig,
        @Optional() @Inject(CNV_ERROR_CONFIG) config: CnvErrorConfig,
    ) {
        this.mergedConfig = {
            errors: {
                ...defaultConfig.errors,
                ...(config?.errors || {}),
            },
        };
    }

    /** Get error config. */
    public getConfig(): CnvErrorConfig {
        return this.mergedConfig;
    }
}
