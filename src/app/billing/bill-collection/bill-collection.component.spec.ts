import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillCollectionComponent } from './bill-collection.component';

describe('BillCollectionComponent', () => {
  let component: BillCollectionComponent;
  let fixture: ComponentFixture<BillCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
