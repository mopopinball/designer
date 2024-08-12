import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerTriggerPropertiesComponent } from './timer-trigger-properties.component';

describe('TimerTriggerPropertiesComponent', () => {
  let component: TimerTriggerPropertiesComponent;
  let fixture: ComponentFixture<TimerTriggerPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerTriggerPropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerTriggerPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
