import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsRendererComponentComponent } from './actions-renderer-component.component';

describe('ActionsRendererComponentComponent', () => {
  let component: ActionsRendererComponentComponent;
  let fixture: ComponentFixture<ActionsRendererComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsRendererComponentComponent]
    });
    fixture = TestBed.createComponent(ActionsRendererComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
