import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Noir7Component } from './noir7.component';

describe('Noir7Component', () => {
  let component: Noir7Component;
  let fixture: ComponentFixture<Noir7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Noir7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Noir7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
