import { TestBed, inject } from '@angular/core/testing';

import { CustomerStatusService } from './customer-status.service';

describe('CustomerStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerStatusService]
    });
  });

  it('should be created', inject([CustomerStatusService], (service: CustomerStatusService) => {
    expect(service).toBeTruthy();
  }));
});
