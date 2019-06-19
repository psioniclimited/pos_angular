import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountTableComponent } from './chart-of-account-table.component';

describe('ChartOfAccountTableComponent', () => {
  let component: ChartOfAccountTableComponent;
  let fixture: ComponentFixture<ChartOfAccountTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOfAccountTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOfAccountTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
