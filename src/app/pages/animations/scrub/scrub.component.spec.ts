import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrubComponent } from './scrub.component';

describe('ScrubComponent', () => {
  let component: ScrubComponent;
  let fixture: ComponentFixture<ScrubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrubComponent]
    });
    fixture = TestBed.createComponent(ScrubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
