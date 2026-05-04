import { TestBed } from '@angular/core/testing';

import { Sugestoes } from './sugestoes';

describe('Sugestoes', () => {
  let service: Sugestoes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sugestoes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
