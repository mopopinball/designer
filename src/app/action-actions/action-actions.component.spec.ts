import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionActionsComponent } from './action-actions.component';

describe('ActionActionsComponent', () => {
  let component: ActionActionsComponent;
  let fixture: ComponentFixture<ActionActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
