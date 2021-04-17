import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperandSelectorComponent } from './operand-selector.component';

describe('OperandSelectorComponent', () => {
  let component: OperandSelectorComponent;
  let fixture: ComponentFixture<OperandSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperandSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperandSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
