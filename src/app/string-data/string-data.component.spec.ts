import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringDataComponent } from './string-data.component';

describe('StringDataComponent', () => {
  let component: StringDataComponent;
  let fixture: ComponentFixture<StringDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
