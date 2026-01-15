import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashView } from './dash-view';

describe('DashView', () => {
  let component: DashView;
  let fixture: ComponentFixture<DashView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
