import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTodoComponent } from './manage-todo.component';

describe('ManageTodoComponent', () => {
  let component: ManageTodoComponent;
  let fixture: ComponentFixture<ManageTodoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTodoComponent]
    });
    fixture = TestBed.createComponent(ManageTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
