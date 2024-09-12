import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataActionPropertiesComponent } from './data-action-properties.component';

describe('DataActionPropertiesComponent', () => {
  let component: DataActionPropertiesComponent;
  let fixture: ComponentFixture<DataActionPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataActionPropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataActionPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
