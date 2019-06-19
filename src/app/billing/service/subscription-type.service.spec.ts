import { TestBed, inject } from '@angular/core/testing';

import { SubscriptionTypeService } from './subscription-type.service';

describe('SubscriptionTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionTypeService]
    });
  });

  it('should be created', inject([SubscriptionTypeService], (service: SubscriptionTypeService) => {
    expect(service).toBeTruthy();
  }));
});
