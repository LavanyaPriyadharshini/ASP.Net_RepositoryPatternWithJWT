import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercardChildComponent } from './usercard-child.component';

describe('UsercardChildComponent', () => {
  let component: UsercardChildComponent;
  let fixture: ComponentFixture<UsercardChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsercardChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercardChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
