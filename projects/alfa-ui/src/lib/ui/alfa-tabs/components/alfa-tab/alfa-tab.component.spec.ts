import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaTabComponent } from './alfa-tab.component';

describe('CnvTabComponent', () => {
    let component: AlfaTabComponent;
    let fixture: ComponentFixture<AlfaTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AlfaTabComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlfaTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
