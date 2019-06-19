import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetCustomerDueListComponent } from './internet-customer-due-list.component';

describe('InternetCustomerDueListComponent', () => {
  let component: InternetCustomerDueListComponent;
  let fixture: ComponentFixture<InternetCustomerDueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetCustomerDueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetCustomerDueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
