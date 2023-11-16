import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface InteractiveElement {
    element: any;
    /** Callback called when pressing the Esc button */
    callback: () => void;
}

/**
 * Service for working with interactive elements.
 *
 * @dynamic
 */
@Injectable({
    providedIn: 'root',
})
export class InteractiveElementsService {
    /** List of open interactive elements */
    private openedInteractiveElements: InteractiveElement[] = [];

    /** @ignore */
    constructor(@Optional() @Inject(DOCUMENT) protected document: Document) {
        fromEvent<KeyboardEvent>(this.document.body, 'keyup')
            .pipe(filter(({ key }) => key === 'Escape'))
            .subscribe(() => {
                this.getLastOpenedElement()?.callback();
            });
    }

    /**
     * Add open element last to list
     * @param element Element
     * @param callback Callback called when the Esc button is pressed
     */
    public pushOpenedElement(element: any, callback: () => void): void {
        this.openedInteractiveElements.push({ element, callback });
    }

    public getLastOpenedElement(): InteractiveElement | undefined {
        return this.openedInteractiveElements[this.openedInteractiveElements.length - 1];
    }

    /** Remove an element from the list of open elements */
    public removeOpenedElement(element: any): void {
        const index = this.openedInteractiveElements.findIndex(
            (openedElement) => openedElement.element === element,
        );

        if (index < 0) {
            return;
        }

        this.openedInteractiveElements.splice(index, 1);
    }

    /** Check if the element is the last one in the list of open elements */
    public isLastOpenedElement(element: any): boolean {
        return this.getLastOpenedElement()?.element === element;
    }

    /** Getter of interactive elements */
    public get interactiveElements(): InteractiveElement[] {
        return this.openedInteractiveElements;
    }
}
