import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnvSelectComponent } from './cnv-select.component';

describe('CnvSelectComponent', () => {
  let component: CnvSelectComponent;
  let fixture: ComponentFixture<CnvSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CnvSelectComponent]
    });
    fixture = TestBed.createComponent(CnvSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
