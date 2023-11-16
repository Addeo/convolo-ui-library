import { TestBed } from '@angular/core/testing';

import { AlfaErrorService } from './alfa-error.service';
import { Alfa_ERROR_DEFAULT_CONFIG } from './alfa-error.tokens';

describe('AlfaErrorService', () => {
    let service: AlfaErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Alfa_ERROR_DEFAULT_CONFIG,
                    useValue: {},
                },
            ],
        });
        service = TestBed.inject(AlfaErrorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
