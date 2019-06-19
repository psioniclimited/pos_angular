import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionTypeTableComponent } from './subscription-type-table.component';

describe('SubscriptionTypeTableComponent', () => {
  let component: SubscriptionTypeTableComponent;
  let fixture: ComponentFixture<SubscriptionTypeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionTypeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
