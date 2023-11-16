/** List of element tags that can be set focus */
export const FOCUSABLE_TAGS: string[] = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input[type="text"]:not([disabled])',
    'input[type="number"]:not([disabled])',
    'input[type="email"]:not([disabled])',
    'input[type="password"]:not([disabled])',
    'input[type="search"]:not([disabled])',
    'input[type="radio"]:not([disabled])',
    'input[type="checkbox"]:not([disabled])',
    'select:not([disabled])',
];

/** Get a list of elements that can be set focus */
export const getFocusableElements = (container: HTMLElement): NodeListOf<HTMLElement> =>
    container.querySelectorAll(FOCUSABLE_TAGS.join());

/** Set tabindex to the list of elements */
export const setTabindexes = (elements: NodeListOf<HTMLElement>, tabindex: number): void => {
    if (elements.length === 0) return;

    elements.forEach((element) => {
        element.tabIndex = tabindex;
    });
};

/** Exclude elements from focusable list */
export const setUnfocusable = (elements: NodeListOf<HTMLElement>): void =>
    setTabindexes(elements, -1);

/** Restore the ability to set focus for a list of items */
export const restoreFocusability = (elements: NodeListOf<HTMLElement>): void => {
    if (elements.length === 0) return;

    elements.forEach((element) => {
        element.removeAttribute('tabindex');
    });
};
