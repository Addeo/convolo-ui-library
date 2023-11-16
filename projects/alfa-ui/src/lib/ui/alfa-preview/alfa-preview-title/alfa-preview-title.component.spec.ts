import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaPreviewTitleComponent } from './alfa-preview-title.component';

describe('AlfaPreviewTitleComponent', () => {
  let component: AlfaPreviewTitleComponent;
  let fixture: ComponentFixture<AlfaPreviewTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlfaPreviewTitleComponent]
    });
    fixture = TestBed.createComponent(AlfaPreviewTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
