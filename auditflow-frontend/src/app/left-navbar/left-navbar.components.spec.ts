import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNavbarComponents } from './left-navbar.components';

describe('SidebarLeftComponent', () => {
  let component: LeftNavbarComponents;
  let fixture: ComponentFixture<LeftNavbarComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftNavbarComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftNavbarComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
