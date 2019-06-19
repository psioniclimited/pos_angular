import { TestBed, inject } from '@angular/core/testing';

import { ChartOfAccountService } from './chart-of-account.service';

describe('ChartOfAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartOfAccountService]
    });
  });

  it('should be created', inject([ChartOfAccountService], (service: ChartOfAccountService) => {
    expect(service).toBeTruthy();
  }));
});
