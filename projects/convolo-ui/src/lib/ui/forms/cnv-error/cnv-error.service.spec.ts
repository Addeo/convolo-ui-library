import { TestBed } from '@angular/core/testing';

import { CnvErrorService } from './cnv-error.service';
import { CNV_ERROR_DEFAULT_CONFIG } from './cnv-error.tokens';

describe('CnvErrorService', () => {
    let service: CnvErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: CNV_ERROR_DEFAULT_CONFIG,
                    useValue: {},
                },
            ],
        });
        service = TestBed.inject(CnvErrorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
