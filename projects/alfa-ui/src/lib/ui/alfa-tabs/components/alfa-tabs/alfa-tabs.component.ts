import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewEncapsulation,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { BaseComponent } from '../../../base-component/base-component.component';
import { AlfaTabComponent } from '../alfa-tab/alfa-tab.component';

/**
 * The tab object for the {@link AlfaTabsComponent}.
 */
export type AlfaTab = {
    name: string;
    label: string;
    disabled?: boolean;
    active?: boolean;
    activated?: boolean;
    stepValue?: number;
};

export type TabsType = 'tabs' | 'stepper';

/**
 * Tab bar component.
 *
 * @example
 * ```html
 * <alfa-tabs
 *   (tabChange)="onTabChange($event)">
 * </alfa-tabs>
 * ```
 */
@Component({
    selector: 'alfa-tabs',
    templateUrl: './alfa-tabs.component.html',
    styleUrls: ['./alfa-tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'alfa-tabs',
    },
})
export class AlfaTabsComponent extends BaseComponent implements AfterContentInit {
    /** Event fired when the active tab changes. */
    @Input() type: TabsType = 'tabs';

    /** Option wrap items. */
    @Input() wrap: boolean = false;

    /** Callback change activated tab */
    @Input() activated$?: Observable<string>;

    @Output() public tabChange = new EventEmitter<string>();

    /** List of displayed tabs. */
    public tabs: AlfaTab[] = [];
    /** Current active tab. */
    public activeTab: string | undefined;

    @ContentChildren(AlfaTabComponent, { descendants: true })
    private tabComponents!: QueryList<AlfaTabComponent>;

    /** List of previous {@link AlfaTabComponent} elements passed to `ng-content` */
    private previousTabComponents: AlfaTabComponent[] = [];

    /**
     * Subscriptions that watch the properties of existing tabs change
     * (for example, changing the name or accessibility of a tab).
     */
    private tabChangeSubscriptions: Subscription[] = [];

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    /** Method called when the tab is clicked. */
    public onTabChange(tab: AlfaTab): void {
        if (this.type === 'stepper' && !tab.activated) return;
        if (this.activeTab === tab.name) return;

        this.activeTab = tab.name;
        this.updateTabsActive();
        this.tabChange.emit(tab.name);
    }

    /** @ignore */
    public ngAfterContentInit(): void {
        this.applyActiveTab();
        this.tabComponents.changes
            .pipe(startWith(this.tabComponents), this.takeUntilDestroy())
            .subscribe((tabs: QueryList<AlfaTabComponent>) => {
                this.handleTabsQueryList(tabs);
            });
        /** listen action activated tab */
        this.applyActivatedTab();
    }

    /** Process updated list of tabs */
    private handleTabsQueryList(tabs: QueryList<AlfaTabComponent>): void {
        // Separate changes to the internal properties of tab components from their
        // complete change, because without this when changing properties in old
        // components, the list of tab buttons will be created anew each time,
        // what interferes with transition effects and affects performance.
        if (this.isSameTabsContent(tabs)) return;

        // Unsubscribe from old tabs to avoid memory leaks.
        this.tabChangeSubscriptions.forEach((sub) => sub.unsubscribe());
        // Whenever properties of existing tab components are changed
        // update the `tabs` array.
        this.tabChangeSubscriptions = tabs.map((tab) =>
            tab.onTabPropertiesChange().subscribe(() => {
                this.updateTabs();
            }),
        );
        this.previousTabComponents = tabs.toArray();
        this.updateTabs();
    }

    /** Update tab properties after changing components in `ng-content` */
    private updateTabs(): void {
        this.tabs = this.tabComponents.map((tab) => ({
            name: tab.name,
            label: tab.label,
            disabled: tab.disabled,
            active: tab.active,
            stepValue: tab.stepValue,
        })) as AlfaTab[];
        this.tabs.forEach((tab) => {
            if (tab.active) {
                this.activeTab = tab.name;
            }
        });
        this.changeDetectorRef.detectChanges();
    }

    /** Set activated tab after initial content render */
    private applyActivatedTab(): void {
        if (this.tabs[0]) this.tabs[0].activated = true;
        this.activated$?.subscribe((value: string) => {
            const newActiveTab = this.tabs.find((tab) => tab.name === value);
            if (newActiveTab) {
                newActiveTab.activated = true;
                this.onTabChange(newActiveTab);
            }
            this.activeTab = value;
            this.updateTabsActive();
            this.updateTabsActivated();
            this.tabChange.emit(value);
            this.changeDetectorRef.detectChanges();
        });
        this.changeDetectorRef.detectChanges();
    }

    /** Set active tab after initial content render */
    private applyActiveTab(): void {
        const activeTabComponent = this.tabComponents.find((tab) => tab.active ?? false);
        this.activeTab = activeTabComponent?.name;
    }

    /** Update the active state of subtabs */
    private updateTabsActive(): void {
        this.tabComponents.forEach((tab) => {
            tab.active = tab.name === this.activeTab;
        });
        this.tabComponents.notifyOnChanges();
    }

    /** Update the activated state of subtabs */
    private updateTabsActivated(): void {
        this.tabComponents.forEach((tab) => {
            tab.activated = tab.activated ?? tab.name === this.activeTab;
        });
        this.tabComponents.notifyOnChanges();
    }

    /**
     * Checks if the {@link AlfaTabComponent} elements in `ng-content` have changed.
     * @param tabs List of elements received in the {@link AlfaTabsComponent.tabComponents.changes} event
     */
    private isSameTabsContent(tabs: QueryList<AlfaTabComponent>): boolean {
        if (tabs.length !== this.previousTabComponents.length) return false;

        let areTheSame = true;
        tabs.find((tab, index) => {
            if (tab === this.previousTabComponents[index]) return true;

            areTheSame = false;
            return false;
        });

        return areTheSame;
    }

    resetActiveTab(nameTabs: string[]) {
        for (const name of nameTabs) {
            const newDisActiveTab = this.tabs.find((tab) => tab.name === name);
            if (newDisActiveTab) {
                newDisActiveTab.activated = false;
            }
            this.updateTabsActive();
            this.updateTabsActivated();
            this.changeDetectorRef.detectChanges();
        }
    }

    /** Method stepper next tab. */
    public getTabNext() {
        const activeTabComponent = this.tabs.find((tab) => tab.name === this.activeTab);
        if (this.type === 'stepper' && activeTabComponent && activeTabComponent.stepValue) {
            // @ts-ignore
            const nextActiveTabComponent = this.tabs.find(
                (tab) => tab.stepValue === activeTabComponent.stepValue! + 1,
            );
            if (nextActiveTabComponent) {
                // this.activeTab = nextActiveTabComponent.name;
                // this.updateTabsActive();
                // this.tabChange.emit(nextActiveTabComponent.name);
                return nextActiveTabComponent;
            }
        }
        return null;
    }

    public getTabPrev() {
        const activeTabComponent = this.tabs.find((tab) => tab.name === this.activeTab);
        if (this.type === 'stepper' && activeTabComponent && activeTabComponent.stepValue) {
            // @ts-ignore
            const prevActiveTabComponent = this.tabs.find(
                (tab) => tab.stepValue === activeTabComponent.stepValue! - 1,
            );
            if (prevActiveTabComponent) {
                // this.activeTab = nextActiveTabComponent.name;
                // this.updateTabsActive();
                // this.tabChange.emit(nextActiveTabComponent.name);
                return prevActiveTabComponent;
            }
        }
        return null;
    }
}
