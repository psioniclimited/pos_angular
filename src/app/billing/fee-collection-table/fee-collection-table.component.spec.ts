import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCollectionTableComponent } from './fee-collection-table.component';

describe('FeeCollectionTableComponent', () => {
  let component: FeeCollectionTableComponent;
  let fixture: ComponentFixture<FeeCollectionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeCollectionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeCollectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
