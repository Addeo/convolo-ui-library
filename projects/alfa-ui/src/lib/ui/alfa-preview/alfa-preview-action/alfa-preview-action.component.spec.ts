import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaPreviewActionComponent } from './alfa-preview-action.component';

describe('AlfaPreviewActionComponent', () => {
  let component: AlfaPreviewActionComponent;
  let fixture: ComponentFixture<AlfaPreviewActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlfaPreviewActionComponent]
    });
    fixture = TestBed.createComponent(AlfaPreviewActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
