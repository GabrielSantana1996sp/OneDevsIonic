import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelaLoginPage } from './tela-login.page';

describe('TelaLoginPage', () => {
  let component: TelaLoginPage;
  let fixture: ComponentFixture<TelaLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
