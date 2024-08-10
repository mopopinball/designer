import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoilComponent } from './coil.component';

describe('CoilComponent', () => {
  let component: CoilComponent;
  let fixture: ComponentFixture<CoilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
