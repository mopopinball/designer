import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateActionPropertiesComponent } from './state-action-properties.component';

describe('StateActionPropertiesComponent', () => {
  let component: StateActionPropertiesComponent;
  let fixture: ComponentFixture<StateActionPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateActionPropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateActionPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
