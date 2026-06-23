import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalhesTopicoPage } from './detalhes-topico.page';

describe('DetalhesTopicoPage', () => {
  let component: DetalhesTopicoPage;
  let fixture: ComponentFixture<DetalhesTopicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesTopicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
