import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDesiredOutputStateDialogComponent } from './create-desired-output-state-dialog.component';

describe('CreateDesiredOutputStateDialogComponent', () => {
  let component: CreateDesiredOutputStateDialogComponent;
  let fixture: ComponentFixture<CreateDesiredOutputStateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDesiredOutputStateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDesiredOutputStateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
