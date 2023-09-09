import { TestBed } from '@angular/core/testing';

import { CssTokensService } from './css-tokens.service';

describe('CssTokensService', () => {
  let service: CssTokensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CssTokensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
