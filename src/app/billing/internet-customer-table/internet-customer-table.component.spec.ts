import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetCustomerTableComponent } from './internet-customer-table.component';

describe('InternetCustomerTableComponent', () => {
  let component: InternetCustomerTableComponent;
  let fixture: ComponentFixture<InternetCustomerTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetCustomerTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetCustomerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
