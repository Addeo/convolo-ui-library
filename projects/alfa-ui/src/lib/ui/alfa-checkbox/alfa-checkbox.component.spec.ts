import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaCheckboxComponent } from './alfa-checkbox.component';

describe('AlfaCheckboxComponent', () => {
    let component: AlfaCheckboxComponent;
    let fixture: ComponentFixture<AlfaCheckboxComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AlfaCheckboxComponent],
        });
        fixture = TestBed.createComponent(AlfaCheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
