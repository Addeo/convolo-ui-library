import { Inject, Injectable, Optional } from '@angular/core';

import { Alfa_ERROR_CONFIG, Alfa_ERROR_DEFAULT_CONFIG } from './alfa-error.tokens';
import { AlfaErrorConfig } from './alfa-error.types';

/**
 * Service for error configuration.
 */
@Injectable({
    providedIn: 'root',
})
export class AlfaErrorService {
    /** Resulting error config. */
    private readonly mergedConfig: AlfaErrorConfig;

    /** @ignore */
    constructor(
        @Inject(Alfa_ERROR_DEFAULT_CONFIG) defaultConfig: AlfaErrorConfig,
        @Optional() @Inject(Alfa_ERROR_CONFIG) config: AlfaErrorConfig,
    ) {
        this.mergedConfig = {
            errors: {
                ...defaultConfig.errors,
                ...(config?.errors || {}),
            },
        };
    }

    /** Get error config. */
    public getConfig(): AlfaErrorConfig {
        return this.mergedConfig;
    }
}
