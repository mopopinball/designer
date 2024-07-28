import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceActionPropertiesComponent } from './device-action-properties.component';

describe('DeviceActionPropertiesComponent', () => {
  let component: DeviceActionPropertiesComponent;
  let fixture: ComponentFixture<DeviceActionPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceActionPropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceActionPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
