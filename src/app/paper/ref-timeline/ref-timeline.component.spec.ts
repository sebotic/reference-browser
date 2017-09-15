import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefTimelineComponent } from './ref-timeline.component';

describe('RefTimelineComponent', () => {
  let component: RefTimelineComponent;
  let fixture: ComponentFixture<RefTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
