import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EngineDiagramDialogComponent } from './engine-diagram-dialog.component';

describe('EngineDiagramDialogComponent', () => {
  let component: EngineDiagramDialogComponent;
  let fixture: ComponentFixture<EngineDiagramDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineDiagramDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineDiagramDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
