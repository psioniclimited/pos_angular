import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCheckboxComponent } from './role-checkbox.component';

describe('RoleCheckboxComponent', () => {
  let component: RoleCheckboxComponent;
  let fixture: ComponentFixture<RoleCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
