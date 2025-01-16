import { TestBed } from '@angular/core/testing';

import { ProductUtilsService } from './product-utils.service';

describe('ProductUtilsService', () => {
  let service: ProductUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
