import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillCollectionTableComponent } from './bill-collection-table.component';

describe('BillCollectionTableComponent', () => {
  let component: BillCollectionTableComponent;
  let fixture: ComponentFixture<BillCollectionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillCollectionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillCollectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
