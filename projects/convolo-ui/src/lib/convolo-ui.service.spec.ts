import { TestBed } from '@angular/core/testing';

import { ConvoloUiService } from './convolo-ui.service';

describe('ConvoloUiService', () => {
  let service: ConvoloUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvoloUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
