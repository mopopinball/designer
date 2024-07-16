import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuleEnginePropertiesComponent } from './rule-engine-properties.component';

describe('RuleEnginePropertiesComponent', () => {
  let component: RuleEnginePropertiesComponent;
  let fixture: ComponentFixture<RuleEnginePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleEnginePropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RuleEnginePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
