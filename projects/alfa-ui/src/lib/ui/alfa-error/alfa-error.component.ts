import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { BaseComponent } from '../base-component/base-component.component';
import { AlfaErrorHandlersRecord } from './alfa-error.types';
import { AlfaErrorService } from './alfa-error.service';

/**
 * Validation errors component.
 *
 * @example
 * ```html
 * <alfa-error
 *   [errorMessages]="errorMessages"
 *   [validationErrors]="errors">
 * </alfa-error>
 * ```
 */
@Component({
    selector: 'alfa-error',
    templateUrl: './alfa-error.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-error',
    },
})
export class AlfaErrorComponent extends BaseComponent implements OnInit, OnChanges {
    /** List of validation error handlers that return the error text. */
    @Input() public errorMessages: AlfaErrorHandlersRecord | undefined | null = {};
    /** Own error message. If passed, no other messages are displayed. */
    @Input() public errorMessage?: string;
    /** List of current validation errors. */
    @Input() public validationErrors: ValidationErrors | undefined | null ;

    /** Result list of error handlers. */
    public resultErrorHandlers!: AlfaErrorHandlersRecord;
    /** Error texts. */
    public errorTexts: string[] = [];

    /** @ignore */
    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly errorService: AlfaErrorService,
    ) {
        super();
    }

    /** @ignore */
    public ngOnInit(): void {
        this.assembleErrorHandlers();
        if (this.validationErrors) {
            this.handleErrors(this.validationErrors);
        }
    }

    /** @ignore */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['errorMessages']) {
            this.assembleErrorHandlers();
        }
        if (changes['validationErrors']) {
            this.handleErrors(this.validationErrors ?? undefined);
            this.changeDetectorRef.markForCheck();
        }
    }

    /** Merge lists of default and parent-passed error handlers. */
    private assembleErrorHandlers(): void {
        this.resultErrorHandlers = {
            ...this.errorService.getConfig().errors,
            ...this.errorMessages,
        };
    }

    /** Processing the list of validation errors and updating the list of error texts. */
    private handleErrors(errors: ValidationErrors | undefined): void {
        if (!errors || !this.resultErrorHandlers) {
            this.errorTexts = [];
            return;
        }

        this.errorTexts = Object.keys(errors)
            .map((errorKey) => {
                const errorHandler = this.resultErrorHandlers[errorKey];
                if (!errorHandler) return null;

                if (typeof errorHandler === 'string') return errorHandler;
                return errorHandler(errors[errorKey]);
            })
            .filter((error): error is string => error !== null);
    }
}
