import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SfdaMainPageComponent } from './sfda-main-page.component';

describe('SfdaMainPageComponent', () => {
  let component: SfdaMainPageComponent;
  let fixture: ComponentFixture<SfdaMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SfdaMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SfdaMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
