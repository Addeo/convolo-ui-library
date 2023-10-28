import { TestBed } from '@angular/core/testing';

import { AlfaUiService } from './alfa-ui.service';

describe('AlfaUiService', () => {
  let service: AlfaUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlfaUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
