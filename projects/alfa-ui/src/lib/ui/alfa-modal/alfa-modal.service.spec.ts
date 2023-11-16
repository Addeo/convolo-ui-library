import { TestBed } from '@angular/core/testing';

import { AlfaModalModule } from './alfa-modal.module';
import { AlfaModalService } from './alfa-modal.service';

describe('AlfaModalService', () => {
    let service: AlfaModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AlfaModalModule],
        });
        service = TestBed.inject(AlfaModalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
