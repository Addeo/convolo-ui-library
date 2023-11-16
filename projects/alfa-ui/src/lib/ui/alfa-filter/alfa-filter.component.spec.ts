import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaFilterComponent } from './alfa-filter.component';

describe('AlfaFilterComponent', () => {
    let component: AlfaFilterComponent;
    let fixture: ComponentFixture<AlfaFilterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AlfaFilterComponent],
        });
        fixture = TestBed.createComponent(AlfaFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
