import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvoloUiComponent } from './convolo-ui.component';

describe('ConvoloUiComponent', () => {
  let component: ConvoloUiComponent;
  let fixture: ComponentFixture<ConvoloUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvoloUiComponent]
    });
    fixture = TestBed.createComponent(ConvoloUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
