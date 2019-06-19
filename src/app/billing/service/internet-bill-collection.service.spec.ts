import { TestBed, inject } from '@angular/core/testing';

import { InternetBillCollectionService } from './internet-bill-collection.service';

describe('InternetBillCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternetBillCollectionService]
    });
  });

  it('should be created', inject([InternetBillCollectionService], (service: InternetBillCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
