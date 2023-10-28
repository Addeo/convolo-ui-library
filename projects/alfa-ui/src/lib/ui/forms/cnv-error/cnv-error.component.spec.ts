import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnvErrorComponent } from './cnv-error.component';
import { CNV_ERROR_DEFAULT_CONFIG } from './cnv-error.tokens';

describe('CnvErrorComponent', () => {
    let component: CnvErrorComponent;
    let fixture: ComponentFixture<CnvErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CnvErrorComponent],
            providers: [
                {
                    provide: CNV_ERROR_DEFAULT_CONFIG,
                    useValue: {},
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CnvErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
