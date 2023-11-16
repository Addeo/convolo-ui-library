import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { fromEvent, timer, withLatestFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BaseComponent } from '../base-component/base-component.component';
import { InteractiveElementsService } from '../../services/interactive-elements.service';
import { ALFA_MODAL, NODES_TO_INSERT } from './tokens';
import { AlfaInternalModalRef } from './alfa-modal-ref';
import { AlfaModalConfig, AlfaModalSize, AlfaModalStyle } from './alfa-modal.interface';

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37,
}

/**
 * Modal.
 */
@Component({
    selector: 'alfa-modal',
    templateUrl: './alfa-modal.component.html',
    styleUrls: ['./alfa-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlfaModalComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Link to the container where the content will be inserted */
    @ViewChild('modal', { static: true }) private modalElement!: ElementRef<HTMLElement>;
    @ViewChild('prevButton', { static: true }) private prevButton!: ElementRef<HTMLElement>;
    @ViewChild('nextButton', { static: true }) private nextButton!: ElementRef<HTMLElement>;

    /** Link to the buttons container actions */
    @ViewChild('sheet', { static: true }) private sheetElement!: ElementRef<HTMLElement>;

    /** @ignore */
    @HostBinding('class.alfa-modal') public readonly alfaModal = true;

    /** @ignore */
    constructor(
        @Inject(ALFA_MODAL) protected readonly config: AlfaModalConfig,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly host: ElementRef<HTMLElement>,
        private readonly modalRef: AlfaInternalModalRef,
        private readonly interactiveElementsService: InteractiveElementsService,
        @Inject(NODES_TO_INSERT) private readonly nodes: Element[],
    ) {
        super();
        // this.nodes.forEach((node) => host.appendChild(node));

        const defaultStyle: AlfaModalStyle = 'default';
        host.nativeElement.classList.add(`alfa-modal_style_${config?.style || defaultStyle}`);

        if (config?.cssClass) {
            host.nativeElement.classList.add(config.cssClass);
        }

        const defaultSize: AlfaModalSize = 'medium';
        host.nativeElement.classList.add(`alfa-modal_size_${config?.size || defaultSize}`);
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (this.nextButton && event.keyCode === KEY_CODE.RIGHT_ARROW) {
            this.nextButton.nativeElement.click();
        }

        if (this.prevButton && event.keyCode === KEY_CODE.LEFT_ARROW) {
            this.prevButton.nativeElement.click();
        }
    }

    /** @ignore */
    public ngOnInit(): void {
        // host itself acts as a backdrop, so as not to create redundant nesting
        const backdropClick$ = fromEvent<MouseEvent>(this.host.nativeElement, 'mouseup').pipe(
            withLatestFrom(fromEvent<MouseEvent>(this.host.nativeElement, 'mousedown')),
            filter((events) =>
                events.every((event) => {
                    const element = event.target as Element;

                    // Check if the element has a parent (to exclude elements that are hidden on click)
                    // and it's not a child of the modal's container or sheet buttons
                    if (this.sheetElement) {
                        return (
                            element.parentElement &&
                            !this.modalElement.nativeElement.contains(element) &&
                            !this.sheetElement.nativeElement.contains(element)
                        );
                    } else {
                        return (
                            element.parentElement &&
                            !this.modalElement.nativeElement.contains(element)
                        );
                    }
                }),
            ),
        );

        backdropClick$
            .pipe(filter(() => this.config.enableBackdropClose))
            .pipe(this.takeUntilDestroy<MouseEvent[]>())
            .subscribe(() => this.closeModal());

        this.nodes.forEach((node) => {
            this.modalElement.nativeElement.appendChild(node);
        });

        this.modalRef.onClose$
            ?.pipe(this.takeUntilDestroy())
            .subscribe((result) => this.closeModal(result));
        /**
         * If the focus needs to be on the first element,
         * then the close button is moved to the end of the nodes so that the focus is not on it.
         */
        // @ts-ignore
        if (this.config.closeButton && this.config.focusableElement === 'first') {
            this.modalElement.nativeElement.appendChild(
                this.modalElement.nativeElement.firstChild!,
            );
        }

        this.modalRef.nextDisabled$?.pipe(this.takeUntilDestroy()).subscribe((result) => {
            // @ts-ignore
            this.config.nextDisabled = result;
            this.changeDetectorRef.markForCheck();
        });
        this.modalRef.backDisabled$?.pipe(this.takeUntilDestroy()).subscribe((result) => {
            // @ts-ignore
            this.config.backDisabled = result;
            this.changeDetectorRef.markForCheck();
        });
        this.modalRef.saveDisabled$?.pipe(this.takeUntilDestroy()).subscribe((result) => {
            // @ts-ignore
            this.config.saveDisabled = result;
            this.changeDetectorRef.markForCheck();
        });
        this.modalRef.showNext$?.pipe(this.takeUntilDestroy()).subscribe((result) => {
            // @ts-ignore
            this.config.showNext = result;
            this.changeDetectorRef.markForCheck();
        });
        this.modalRef.showBack$?.pipe(this.takeUntilDestroy()).subscribe((result) => {
            // @ts-ignore
            this.config.showBack = result;
            this.changeDetectorRef.markForCheck();
        });

        /**
         * Create a macrotask so that the animation of the appearance from hanging the class works.
         */
        timer(0).subscribe(() => this.host.nativeElement.classList.add('_is-visible'));
    }

    /** @ignore */
    public ngAfterViewInit(): void {
        this.interactiveElementsService.pushOpenedElement(this, () => {
            if (this.config.enableEscClose) {
                this.closeModal();
            }
        });
        this.changeDetectorRef.markForCheck();
    }

    /** Fires when the close button is clicked */
    public onClickClose(): void {
        this.closeModal();
    }

    /** Closes the modal window */
    public closeModal(result?: unknown): void {
        this.interactiveElementsService.removeOpenedElement(this);
        this.host.nativeElement.classList.remove('_is-visible');
        timer(285).subscribe(() => this.modalRef.onClose(result));
    }

    backClick() {
        this.modalRef.back();
    }

    nextClick() {
        this.modalRef.next();
    }

    saveClick() {
        this.modalRef.save();
    }
}
