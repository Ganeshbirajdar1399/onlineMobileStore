import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(true); // Initial state is true (loading)
  isLoading = this.loading.asObservable();

  constructor() {}

  setLoading(loading: boolean): void {
    this.loading.next(loading);
  }
}
