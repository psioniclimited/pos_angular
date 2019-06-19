import { TestBed, inject } from '@angular/core/testing';

import { InternetCustomerService } from './internet-customer.service';

describe('InternetCustomerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternetCustomerService]
    });
  });

  it('should be created', inject([InternetCustomerService], (service: InternetCustomerService) => {
    expect(service).toBeTruthy();
  }));
});
