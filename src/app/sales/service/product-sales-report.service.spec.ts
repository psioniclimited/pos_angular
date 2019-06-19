import { TestBed, inject } from '@angular/core/testing';

import { ProductSalesReportService } from './product-sales-report.service';

describe('ProductSalesReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductSalesReportService]
    });
  });

  it('should be created', inject([ProductSalesReportService], (service: ProductSalesReportService) => {
    expect(service).toBeTruthy();
  }));
});
