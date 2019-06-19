import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTypesTableComponent } from './fee-types-table.component';

describe('FeeTypesTableComponent', () => {
  let component: FeeTypesTableComponent;
  let fixture: ComponentFixture<FeeTypesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeTypesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
