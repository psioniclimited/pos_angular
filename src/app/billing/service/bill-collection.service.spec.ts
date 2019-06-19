import { TestBed, inject } from '@angular/core/testing';

import { BillCollectionService } from './bill-collection.service';

describe('BillCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillCollectionService]
    });
  });

  it('should be created', inject([BillCollectionService], (service: BillCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
