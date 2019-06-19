import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountFormComponent } from './chart-of-account-form.component';

describe('ChartOfAccountFormComponent', () => {
  let component: ChartOfAccountFormComponent;
  let fixture: ComponentFixture<ChartOfAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOfAccountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOfAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
