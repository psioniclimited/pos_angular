import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetRefundHistoryComponent } from './internet-refund-history.component';

describe('InternetRefundHistoryComponent', () => {
  let component: InternetRefundHistoryComponent;
  let fixture: ComponentFixture<InternetRefundHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetRefundHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetRefundHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
