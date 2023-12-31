import { AlfaErrorConfig } from './alfa-error.types';

export const AlfaErrorDefaultConfig: AlfaErrorConfig = {
    errors: {
        required: 'Required field',
        email: 'Invalid email',
        pattern: 'Invalid string format',
        minlength: (data) =>
            `Should be at least ${
                data && data['requiredLength'] ? data['requiredLength'] : ''
            } characters`,
        maxlength: (data) =>
            `Should be no more than ${
                data && data['requiredLength'] ? data['requiredLength'] : ''
            } characters`,
    },
};
