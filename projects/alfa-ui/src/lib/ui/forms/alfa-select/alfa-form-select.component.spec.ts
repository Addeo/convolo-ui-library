import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaFormSelectComponent } from './alfa-form-select.component';

describe('AlfaSelectComponent', () => {
    let component: AlfaFormSelectComponent;
    let fixture: ComponentFixture<AlfaFormSelectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AlfaFormSelectComponent],
        });
        fixture = TestBed.createComponent(AlfaFormSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
