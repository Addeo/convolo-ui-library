import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaPreviewZoomComponent } from './alfa-preview-zoom.component';

describe('AlfaPreviewZoomComponent', () => {
  let component: AlfaPreviewZoomComponent;
  let fixture: ComponentFixture<AlfaPreviewZoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlfaPreviewZoomComponent]
    });
    fixture = TestBed.createComponent(AlfaPreviewZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
