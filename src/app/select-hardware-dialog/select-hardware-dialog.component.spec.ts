import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHardwareDialogComponent } from './select-hardware-dialog.component';

describe('SelectHardwareDialogComponent', () => {
  let component: SelectHardwareDialogComponent;
  let fixture: ComponentFixture<SelectHardwareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectHardwareDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHardwareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
