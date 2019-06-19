import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainTableComponent } from './complain-table.component';

describe('ComplainTableComponent', () => {
  let component: ComplainTableComponent;
  let fixture: ComponentFixture<ComplainTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
