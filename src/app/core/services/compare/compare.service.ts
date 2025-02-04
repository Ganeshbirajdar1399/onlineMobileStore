import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, EMPTY } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  private readonly baseUrl = environment.apiUrl; // Fixed base URL
  private readonly compareEndpoint = `${this.baseUrl}/compare`; // Full compare endpoint
  private readonly MAX_ITEMS = 4; // Maximum allowed items in the compare list

  private compareSubject = new BehaviorSubject<any[]>([]); // BehaviorSubject for compare list
  private compareCountSubject = new BehaviorSubject<number>(0); // BehaviorSubject for item count

  constructor(private http: HttpClient) {
    // Initialize compare list by fetching items from the server
    this.fetchCompareItems();
  }

  private fetchCompareItems(): void {
    this.getCompareItems().subscribe((items) => this.updateList(items));
  }

  private updateList(items: any[]): void {
    this.compareSubject.next(items);
    this.compareCountSubject.next(items.length);
  }

  addToCompare(product: any): Observable<any> {
    const compareList = this.compareSubject.getValue();

    if (compareList.length >= this.MAX_ITEMS) {
      alert(`Compare list is full! You can only add up to ${this.MAX_ITEMS} items.`);
      return EMPTY;
    }

    if (compareList.some((item) => item.id === product.id)) {
      alert('Product is already in the compare list!');
      return EMPTY;
    }

    const newProduct = { ...product, quantity: 1 };
    return this.http.post<any>(this.compareEndpoint, newProduct).pipe(
      tap(() => this.updateList([...compareList, newProduct]))
    );
  }

  removeFromCompare(id: string): Observable<any> {
    const updatedList = this.compareSubject.getValue().filter((item) => item.id !== id);

    return this.http.delete(`${this.compareEndpoint}/${id}`).pipe(
      tap(() => this.updateList(updatedList))
    );
  }

  getCompareItems(): Observable<any[]> {
    return this.http.get<any[]>(this.compareEndpoint);
  }

  clearCompare(): void {
    this.updateList([]);
  }

  getCompareObservable(): Observable<any[]> {
    return this.compareSubject.asObservable();
  }

  getCompareCountObservable(): Observable<number> {
    return this.compareCountSubject.asObservable();
  }
}
