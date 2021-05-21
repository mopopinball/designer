import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchSelectorComponent } from './switch-selector.component';

describe('SwitchSelectorComponent', () => {
  let component: SwitchSelectorComponent;
  let fixture: ComponentFixture<SwitchSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
