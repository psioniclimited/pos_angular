import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDueListComponent } from './customer-due-list.component';

describe('CustomerDueListComponent', () => {
  let component: CustomerDueListComponent;
  let fixture: ComponentFixture<CustomerDueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
