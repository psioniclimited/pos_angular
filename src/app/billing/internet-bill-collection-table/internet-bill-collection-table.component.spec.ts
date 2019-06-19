import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetBillCollectionTableComponent } from './internet-bill-collection-table.component';

describe('InternetBillCollectionTableComponent', () => {
  let component: InternetBillCollectionTableComponent;
  let fixture: ComponentFixture<InternetBillCollectionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetBillCollectionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetBillCollectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
