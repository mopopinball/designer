import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesiredOutputStateComponent } from './desired-output-state.component';

describe('DesiredOutputStateComponent', () => {
  let component: DesiredOutputStateComponent;
  let fixture: ComponentFixture<DesiredOutputStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesiredOutputStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesiredOutputStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
