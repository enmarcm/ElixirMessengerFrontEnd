import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewStatusPage } from './view-status.page';

describe('ViewStatusPage', () => {
  let component: ViewStatusPage;
  let fixture: ComponentFixture<ViewStatusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
