import { TestBed, inject } from '@angular/core/testing';

import { CustomerBillDetailService } from './customer-bill-detail.service';

describe('CustomerBillDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerBillDetailService]
    });
  });

  it('should be created', inject([CustomerBillDetailService], (service: CustomerBillDetailService) => {
    expect(service).toBeTruthy();
  }));
});
