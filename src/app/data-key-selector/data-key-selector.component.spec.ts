import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataKeySelectorComponent } from './data-key-selector.component';

describe('DataKeySelectorComponent', () => {
  let component: DataKeySelectorComponent;
  let fixture: ComponentFixture<DataKeySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataKeySelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataKeySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
