import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaUiComponent } from './alfa-ui.component';

describe('AlfaUiComponent', () => {
  let component: AlfaUiComponent;
  let fixture: ComponentFixture<AlfaUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlfaUiComponent]
    });
    fixture = TestBed.createComponent(AlfaUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
