import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetCustomerFormComponent } from './internet-customer-form.component';

describe('InternetCustomerFormComponent', () => {
  let component: InternetCustomerFormComponent;
  let fixture: ComponentFixture<InternetCustomerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetCustomerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetCustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
