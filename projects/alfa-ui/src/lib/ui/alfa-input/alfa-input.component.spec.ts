import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaInputComponent } from './alfa-input.component';

describe('AlfaInputComponent', () => {
    let component: AlfaInputComponent;
    let fixture: ComponentFixture<AlfaInputComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AlfaInputComponent],
        });
        fixture = TestBed.createComponent(AlfaInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
