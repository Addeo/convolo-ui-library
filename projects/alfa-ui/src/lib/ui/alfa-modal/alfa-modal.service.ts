import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Inject,
    Injectable,
    Injector,
    isDevMode,
    Optional,
    TemplateRef,
    Type,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

import { ALFA_MODAL, ALFA_MODAL_CONFIG, NODES_TO_INSERT } from './tokens';
import { AlfaInternalModalRef, AlfaModalRef } from './alfa-modal-ref';
import { AlfaModalComponent } from './alfa-modal.component';
import { AlfaModalConfig, AlfaModalGlobalConfig } from './alfa-modal.interface';
import { AlfaModalModule } from './alfa-modal.module';

interface OpenParams {
    config: Partial<AlfaModalConfig>;
    modalRef: AlfaInternalModalRef;
}

/**
 * Service for dynamically creating a modal window.
 */
@Injectable({
    providedIn: AlfaModalModule,
})
export class AlfaModalService {
    /** @ignore */
    constructor(
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        @Inject(DOCUMENT) private document: Document,
        @Inject(ALFA_MODAL) private defaultConfig: AlfaModalConfig,
        @Inject(ALFA_MODAL_CONFIG) @Optional() private globalConfig: AlfaModalGlobalConfig | null,
    ) {}

    /**
     * Open modal window.
     *
     * @param componentOrTemplate Component (reference to constructor object) or template (ng-template)
     * @param config Configuration object
     * @returns Link to modal window
     */

    public open(
        componentOrTemplate: Type<any> | TemplateRef<any>,
        config?: Partial<AlfaModalConfig>,
    ): AlfaModalRef {
        const mergedConfig: Partial<AlfaModalConfig> = {
            ...this.defaultConfig,
            ...this.globalConfig,
            ...config,
        };
        const modalRef = new AlfaInternalModalRef({
            data: mergedConfig.data,
        });

        const params: OpenParams = {
            config: mergedConfig,
            modalRef,
        };

        return componentOrTemplate instanceof TemplateRef
            ? this.openTemplate(componentOrTemplate, params)
            : this.openComponent(componentOrTemplate, params);
    }

    /** Open component in dialog box */
    private openComponent(component: Type<any>, { config, modalRef }: OpenParams): AlfaModalRef {
        const factory = this.componentFactoryResolver.resolveComponentFactory(component);
        const componentRef = factory.create(
            Injector.create({
                providers: [
                    {
                        provide: AlfaModalRef,
                        useValue: modalRef,
                    },
                    {
                        provide: ALFA_MODAL,
                        useValue: config,
                    },
                ],
                parent: this.injector,
            }),
        );

        return this.attach({
            modalRef,
            config,
            view: componentRef.hostView as EmbeddedViewRef<any>,
        });
    }

    /** Open template in dialog box */
    private openTemplate(
        template: TemplateRef<any>,
        { config, modalRef }: OpenParams,
    ): AlfaModalRef {
        const context = {
            config,
            $implicit: modalRef,
        };
        const view = template.createEmbeddedView(context);

        return this.attach({
            modalRef,
            config,
            view,
        });
    }

    /** Adds the component to the DOM */
    private attach({
        modalRef,
        config,
        view,
    }: {
        modalRef: AlfaInternalModalRef;
        config: Partial<AlfaModalConfig>;
        view: EmbeddedViewRef<any>;
    }): AlfaModalRef {
        const modal: ComponentRef<AlfaModalComponent> = this.createModal(
            config as AlfaModalConfig,
            modalRef,
            view,
        );
        const container = this.document.body;

        const hooks = {
            afterClose: new Subject<unknown>(),
        };

        modalRef.onClose$ = new Subject<unknown>();
        modalRef.onBackClick$ = new Subject<unknown>();
        modalRef.onNextClick$ = new Subject<unknown>();
        modalRef.onSaveClick$ = new Subject<unknown>();
        modalRef.nextDisabled$ = new Subject<boolean>();
        modalRef.backDisabled$ = new Subject<boolean>();
        modalRef.saveDisabled$ = new Subject<boolean>();
        modalRef.showNext$ = new Subject<boolean>();
        modalRef.showBack$ = new Subject<boolean>();

        modalRef.onClose = (result?: unknown): void => {
            try {
                container.removeChild(modal.location.nativeElement);
                this.appRef.detachView(modal.hostView);
                this.appRef.detachView(view);

                modal.destroy();
                view.destroy();

                hooks.afterClose.next(result);
                hooks.afterClose.complete();
            } catch (err) {
                if (isDevMode()) {
                    console.warn('Error when closing modal');
                }
            }
        };

        modalRef.afterClose$ = hooks.afterClose.asObservable();

        container.appendChild(modal.location.nativeElement);
        this.appRef.attachView(modal.hostView);
        this.appRef.attachView(view);

        return modalRef.asModalRef();
    }

    /** Using the factory, creates an instance of the modal window */
    private createModal(
        config: AlfaModalConfig,
        modalRef: AlfaInternalModalRef,
        view: EmbeddedViewRef<any>,
    ): ComponentRef<AlfaModalComponent> {
        const modalFactory =
            this.componentFactoryResolver.resolveComponentFactory(AlfaModalComponent);

        return modalFactory.create(
            Injector.create({
                providers: [
                    {
                        provide: AlfaInternalModalRef,
                        useValue: modalRef,
                    },
                    {
                        provide: ALFA_MODAL,
                        useValue: config,
                    },
                    {
                        provide: NODES_TO_INSERT,
                        useValue: view.rootNodes,
                    },
                ],
                parent: this.injector,
            }),
        );
    }
}
