import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidanceDocumentComponent } from './guidance-document.component';

describe('GuidanceDocumentComponent', () => {
  let component: GuidanceDocumentComponent;
  let fixture: ComponentFixture<GuidanceDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidanceDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuidanceDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
