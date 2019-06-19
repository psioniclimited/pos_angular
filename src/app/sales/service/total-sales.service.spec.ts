import { TestBed, inject } from '@angular/core/testing';

import { TotalSalesService } from './total-sales.service';

describe('TotalSalesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TotalSalesService]
    });
  });

  it('should be created', inject([TotalSalesService], (service: TotalSalesService) => {
    expect(service).toBeTruthy();
  }));
});
