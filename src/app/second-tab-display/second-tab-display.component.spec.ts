import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondTabDisplayComponent } from './second-tab-display.component';

describe('SecondTabDisplayComponent', () => {
  let component: SecondTabDisplayComponent;
  let fixture: ComponentFixture<SecondTabDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondTabDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondTabDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
