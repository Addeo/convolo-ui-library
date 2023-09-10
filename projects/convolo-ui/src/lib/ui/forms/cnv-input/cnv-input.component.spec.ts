import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnvInputComponent } from './cnv-input.component';

describe('CnvInputComponent', () => {
  let component: CnvInputComponent;
  let fixture: ComponentFixture<CnvInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CnvInputComponent]
    });
    fixture = TestBed.createComponent(CnvInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
