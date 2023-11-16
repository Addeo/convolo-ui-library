import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaPreviewPaginationComponent } from './alfa-preview-pagination.component';

describe('AlfaPreviewPaginationComponent', () => {
  let component: AlfaPreviewPaginationComponent;
  let fixture: ComponentFixture<AlfaPreviewPaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlfaPreviewPaginationComponent]
    });
    fixture = TestBed.createComponent(AlfaPreviewPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
