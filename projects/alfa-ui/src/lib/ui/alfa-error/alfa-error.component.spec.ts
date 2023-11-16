import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaErrorComponent } from './alfa-error.component';
import { Alfa_ERROR_DEFAULT_CONFIG } from './alfa-error.tokens';

describe('AlfaErrorComponent', () => {
    let component: AlfaErrorComponent;
    let fixture: ComponentFixture<AlfaErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AlfaErrorComponent],
            providers: [
                {
                    provide: Alfa_ERROR_DEFAULT_CONFIG,
                    useValue: {},
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlfaErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
