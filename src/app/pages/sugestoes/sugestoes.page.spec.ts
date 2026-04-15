import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SugestoesPage } from './sugestoes.page';

describe('SugestoesPage', () => {
  let component: SugestoesPage;
  let fixture: ComponentFixture<SugestoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SugestoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
