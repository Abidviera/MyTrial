import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollthreedComponent } from './scrollthreed.component';

describe('ScrollthreedComponent', () => {
  let component: ScrollthreedComponent;
  let fixture: ComponentFixture<ScrollthreedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrollthreedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollthreedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
