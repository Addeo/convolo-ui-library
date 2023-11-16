import { FormControl } from '@angular/forms';
import { MaskSettings } from '../alfa-mask';
// import { CnvIconName } from '$components/alfa-icons';
// import { CnvNoteType } from '$components/alfa-note';

export type AlfaInputType =
    | 'color'
    | 'date'
    | 'datetime'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'month'
    | 'number'
    | 'password'
    | 'range'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';

export type AlfaInputSize = 'normal' | 'medium' | 'small' | 'super-small';

export type AlfaCustomInputType = 'text' | 'phone';

