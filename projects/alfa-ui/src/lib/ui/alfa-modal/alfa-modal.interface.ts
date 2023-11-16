import { AlfaFocusTrapDirective } from '../../directives/alfa-focus-trap';

/** Modal size */
export type AlfaModalSize = 'medium';
/** Modal style */
export type AlfaModalStyle = 'default' | 'sidebar' | 'modal_fit';
/** Modal buttons type */
export type AlfaModalButtons = 'default' | 'stepper' | 'save';

/** Global settings for modal */
export interface AlfaModalGlobalConfig {
    /** Presence of a close button, true by default */
    closeButton: boolean;
    /** Additional css class on the modal */
    cssClass: string;
    /** Ability to close the modal by clicking on the background, true by default */
    enableBackdropClose: boolean;
    /** Ability to close the modal window by pressing the Esc key, true by default */
    enableEscClose: boolean;
    /** The element that will have focus when the window is opened */
    focusableElement: AlfaFocusTrapDirective;
    /** Modal size */
    size: AlfaModalSize;
    /** Modal style */
    style: AlfaModalStyle;
    typeButtons: AlfaModalButtons;
    /** Modal buttons stepper is disabled */
    backDisabled?: boolean;
    nextDisabled?: boolean;

    saveDisabled?: boolean;
    /** Modal buttons stepper is show button */
    showBack?: boolean;
    showNext?: boolean;
}

/** Settings for a specific modal */
export interface AlfaModalConfig<Data = any> extends AlfaModalGlobalConfig {
    /** Data passed internally */
    data: Data;
}
