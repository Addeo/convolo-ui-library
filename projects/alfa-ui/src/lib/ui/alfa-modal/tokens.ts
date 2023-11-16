import { InjectionToken, ViewRef } from '@angular/core';
import { AlfaModalConfig } from './alfa-modal.interface';

export const ALFA_MODAL_CONFIG = new InjectionToken<Partial<AlfaModalConfig>>('ALFA_MODAL_CONFIG');

export const ALFA_MODAL = new InjectionToken<Partial<AlfaModalConfig>>('ALFA_MODAL', {
    providedIn: 'root',
    factory: () => ({
        closeButton: true,
        cssClass: undefined,
        data: undefined,
        enableBackdropClose: true,
        enableEscClose: true,
        focusableElement: undefined,
        size: 'medium',
        style: undefined,
        typeButtons: 'default',
        showBack: true,
        showNext: true,
    }),
});

export const NODES_TO_INSERT = new InjectionToken<ViewRef>('Nodes inserted into the modal');
