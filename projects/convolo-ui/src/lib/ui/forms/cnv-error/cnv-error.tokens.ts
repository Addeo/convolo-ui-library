import { InjectionToken } from '@angular/core';

import { CnvErrorConfig } from './cnv-error.types';

export const CNV_ERROR_CONFIG = new InjectionToken<Partial<CnvErrorConfig>>('CNV_ERROR_CONFIG');
export const CNV_ERROR_DEFAULT_CONFIG = new InjectionToken<Partial<CnvErrorConfig>>(
    'CNV_ERROR_DEFAULT_CONFIG',
);
