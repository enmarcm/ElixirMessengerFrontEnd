import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditStatusPage } from './edit-status.page';

describe('EditStatusPage', () => {
  let component: EditStatusPage;
  let fixture: ComponentFixture<EditStatusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
