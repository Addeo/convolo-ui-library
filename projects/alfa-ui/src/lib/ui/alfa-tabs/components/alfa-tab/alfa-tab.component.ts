import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BaseComponent } from '../../../base-component/base-component.component';
import { randomString } from '../../../../utils/random-string.util';

/**
 * Tab component for {@link CnvTabsComponent}
 *
 * @example
 * ```html
 * <alfa-tab name="tab1" label="label 1">
 *   <p>content 1</p>
 * </alfa-tab>
 * ```
 */
@Component({
    selector: 'alfa-tab',
    templateUrl: './alfa-tab.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AlfaTabComponent extends BaseComponent implements OnInit, OnChanges {
    /** Tab name */
    @Input() public name!: string;
    /** Tab value for stepper elem */
    @Input() public stepValue?: number;
    /** Tab label */
    @Input() public label?: string;
    /** Tab active flag */
    private internalActive = false;

    /** Tab activity flag getter */
    @Input()
    public get active(): boolean {
        return this.internalActive;
    }

    /** Tab activity flag setter */
    public set active(value: boolean) {
        this.internalActive = value;
        this.changeDetectorRef.markForCheck();
    }

    /** Tab activated */
    @Input() public activated?: boolean;

    /** Disable tab */
    @Input() public disabled?: boolean;
    /**
     * Lazy content loading flag. If set to `true` the content will be initialized,
     * only when the current tab is open. To work correctly, the content must be
     * wrapped in `<ng-template>`.
     *
     * @example
     * ```html
     * <alfa-tab [lazy]="true" name="tab1" label="label 1">
     *    <ng-template>
     *      <p>content 1</p>
     *    </ng-template>
     * </alfa-tab>
     * ```
     */
    @Input() public lazy?: boolean;

    /**
     * Event of changing tab properties affecting
     * on the state and behavior of the parent component.
     */
    private tabPropertiesChange$ = new Subject<void>();

    /** Ref to `ng-template` for lazy tab loading */
    @ContentChild(TemplateRef) public template!: TemplateRef<any>;

    /** @ignore */
    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    /** @ignore */
    public ngOnInit(): void {
        /** Generates a random name for the tab if none is provided */
        this.name ??= randomString(5);
    }

    /** @ignore */
    public ngOnChanges(changes: SimpleChanges): void {
      //@ts-ignore
        if (changes.name || changes.label || changes.disabled || changes.active) {
            this.tabPropertiesChange$.next();
        }
    }

    /** Observable for the tab properties change event for the parent component */
    public onTabPropertiesChange(): Observable<void> {
        return this.tabPropertiesChange$.pipe(this.takeUntilDestroy());
    }
}
