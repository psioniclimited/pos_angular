import { TestBed, inject } from '@angular/core/testing';

import { RolePermissionService } from './role-permission.service';

describe('RolePermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RolePermissionService]
    });
  });

  it('should be created', inject([RolePermissionService], (service: RolePermissionService) => {
    expect(service).toBeTruthy();
  }));
});
