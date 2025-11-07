import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistParentComponent } from './userlist-parent.component';

describe('UserlistParentComponent', () => {
  let component: UserlistParentComponent;
  let fixture: ComponentFixture<UserlistParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserlistParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlistParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
