import { TestBed, inject } from '@angular/core/testing';

import { FeeCollectionService } from './fee-collection.service';

describe('FeeCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeCollectionService]
    });
  });

  it('should be created', inject([FeeCollectionService], (service: FeeCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
