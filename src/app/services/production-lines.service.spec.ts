import { TestBed } from '@angular/core/testing';

import { ProductionLinesService } from './production-lines.service';

describe('ProductionLinesService', () => {
  let service: ProductionLinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionLinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
