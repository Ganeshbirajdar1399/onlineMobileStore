import { TestBed } from '@angular/core/testing';

import { ToastrconfirmService } from './toastrconfirm.service';

describe('ToastrconfirmService', () => {
  let service: ToastrconfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrconfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
