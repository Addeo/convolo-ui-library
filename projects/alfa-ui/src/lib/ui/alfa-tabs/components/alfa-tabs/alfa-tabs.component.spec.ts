import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaTabComponent } from '../alfa-tab/alfa-tab.component';
import { AlfaTabsComponent } from './alfa-tabs.component';

@Component({
    selector: 'alfa-test-tabs',
    template: `<alfa-tabs>
        <alfa-tab name="tab1" label="label 1" [active]="true">
            <p>content 1</p>
        </alfa-tab>
        <alfa-tab name="tab2" label="label 2" [active]="false">
            <p>content 2</p>
        </alfa-tab>
        <alfa-tab name="tab3" label="label 3" [active]="false">
            <p>content 3</p>
        </alfa-tab>
    </alfa-tabs>`,
})
class TestCnvTabsComponent {}

describe('CnvTabsComponent', () => {
    let component: AlfaTabsComponent;
    let fixture: ComponentFixture<TestCnvTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestCnvTabsComponent, AlfaTabsComponent, AlfaTabComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestCnvTabsComponent);
        component = fixture.debugElement.children[0]?.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
