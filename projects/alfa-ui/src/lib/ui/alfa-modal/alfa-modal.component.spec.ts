import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlfaModalComponent } from './alfa-modal.component';

describe('AlfaModalComponent', () => {
    let component: AlfaModalComponent;
    let fixture: ComponentFixture<AlfaModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AlfaModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlfaModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
