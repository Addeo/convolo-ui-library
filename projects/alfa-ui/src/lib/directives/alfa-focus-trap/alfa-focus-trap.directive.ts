import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

import { BaseComponent } from '../../ui/base-component/base-component.component';
import { getFocusableElements } from '../../utils/focusable-element.util';

/** The element to which the caught focus will be transferred */
export type AlfaFocusTrapFocusableElement = 'first' | 'last';

/**
 * Directive to limit the ability to focus within a given element.
 * For example, when opening a modal window, you can leave the ability to navigate
 * on interactive elements using Tab and Shift+Tab only inside a modal window.
 */
@Directive({
    selector: '[alfaFocusTrap]',
})
export class AlfaFocusTrapDirective extends BaseComponent implements AfterViewInit, OnDestroy {
    /** Which element to transfer the caught focus to */
    @Input() focusableElement: AlfaFocusTrapFocusableElement = 'first';

    /** The element that had focused before the focus was captured */
    private initialFocusedElement!: HTMLElement;

    /** @ignore */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private el: ElementRef,
    ) {
        super();
    }

    /** @ignore */
    public ngAfterViewInit(): void {
        this.initialFocusedElement = document.activeElement as HTMLElement;
        queueMicrotask(() => this.trapFocus(this.el.nativeElement));
    }

    /** Catches focus inside the element, preventing it from going out of bounds */
    private trapFocus(element: HTMLElement): void {
        const focusableEls: NodeListOf<HTMLElement> = getFocusableElements(element);

        if (focusableEls.length === 0) return;

        const firstFocusableEl: HTMLElement = focusableEls[0]!;
        const lastFocusableEl: HTMLElement = focusableEls[focusableEls.length - 1]!;

        if (this.focusableElement === 'last') {
            lastFocusableEl.focus();
        } else {
            firstFocusableEl.focus();
        }
        if (this.focusableElement === undefined) {
            firstFocusableEl.blur();
        }

        fromEvent<KeyboardEvent>(element, 'keydown')
            .pipe(filter(({ key }) => key === 'Tab'))
            .pipe(this.takeUntilDestroy<KeyboardEvent>())
            .subscribe((evt: KeyboardEvent) => {
                if (evt.shiftKey) {
                    if (this.document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        evt.preventDefault();
                    }
                } else {
                    if (this.document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        evt.preventDefault();
                    }
                }
            });
    }

    /** @ignore */
    // @ts-ignore
    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.returnFocus();
    }

    /** Returns focus to where it was caught */
    private returnFocus(): void {
        if (this.initialFocusedElement) {
            this.initialFocusedElement.focus();
        }
    }
}
