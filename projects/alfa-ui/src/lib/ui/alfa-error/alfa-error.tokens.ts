import { InjectionToken } from '@angular/core';

import { AlfaErrorConfig } from './alfa-error.types';

export const Alfa_ERROR_CONFIG = new InjectionToken<Partial<AlfaErrorConfig>>('Alfa_ERROR_CONFIG');
export const Alfa_ERROR_DEFAULT_CONFIG = new InjectionToken<Partial<AlfaErrorConfig>>(
    'Alfa_ERROR_DEFAULT_CONFIG',
);
