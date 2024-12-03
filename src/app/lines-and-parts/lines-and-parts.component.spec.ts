import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesAndPartsComponent } from './lines-and-parts.component';

describe('LinesAndPartsComponent', () => {
  let component: LinesAndPartsComponent;
  let fixture: ComponentFixture<LinesAndPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinesAndPartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinesAndPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
