import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchTriggerPropertiesComponent } from './switch-trigger-properties.component';

describe('SwitchTriggerPropertiesComponent', () => {
  let component: SwitchTriggerPropertiesComponent;
  let fixture: ComponentFixture<SwitchTriggerPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchTriggerPropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchTriggerPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
