import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPanel } from './widget-panel';

describe('WidgetPanel', () => {
  let component: WidgetPanel;
  let fixture: ComponentFixture<WidgetPanel>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
