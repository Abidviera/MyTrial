import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollinggalleryComponent } from './scrollinggallery.component';

describe('ScrollinggalleryComponent', () => {
  let component: ScrollinggalleryComponent;
  let fixture: ComponentFixture<ScrollinggalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrollinggalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollinggalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
