import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamedActionComponent } from './named-action.component';

describe('NamedActionComponent', () => {
  let component: NamedActionComponent;
  let fixture: ComponentFixture<NamedActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NamedActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
