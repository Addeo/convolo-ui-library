import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaSelectComponent } from './alfa-select.component';

describe('AlfaSelectComponent', () => {
    let component: AlfaSelectComponent;
    let fixture: ComponentFixture<AlfaSelectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AlfaSelectComponent],
        });
        fixture = TestBed.createComponent(AlfaSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
