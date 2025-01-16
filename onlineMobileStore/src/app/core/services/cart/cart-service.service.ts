import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl = environment.apiUrl; // Base URL
  private readonly cartEndpoint = `${this.baseUrl}/cart`; // Cart endpoint

  private cartItems: any[] = [];
  private totalAmount: number = 0;

  private cartSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.loadCartFromServer();
  }

  setCartItems(cartItems: any[], totalAmount: number): void {
    this.cartItems = cartItems;
    this.totalAmount = totalAmount;
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  private loadCartFromServer(): void {
    this.http.get<any[]>(this.cartEndpoint).subscribe((cartItems) => {
      this.cartSubject.next(cartItems);
    });
  }

  getCartItem(): Observable<any[]> {
    return this.http.get<any[]>(this.cartEndpoint).pipe(
      tap((response) => this.cartSubject.next(response))
    );
  }

  addToCart(product: any): Observable<any> {
    const cart = this.cartSubject.getValue();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      return this.http
        .put<any>(`${this.cartEndpoint}/${existingItem.id}`, existingItem)
        .pipe(tap(() => this.cartSubject.next([...cart])));
    } else {
      const newProduct = { ...product, quantity: 1 };
      return this.http.post<any>(this.cartEndpoint, newProduct).pipe(
        tap(() => this.cartSubject.next([...cart, newProduct]))
      );
    }
  }

  removeItem(id: string): Observable<any> {
    const cart = this.cartSubject.getValue().filter((item) => item.id !== id);
    this.cartSubject.next(cart);

    return this.http.delete(`${this.cartEndpoint}/${id}`);
  }

  clearCart(): Observable<any> {
    return this.http.get<any[]>(this.cartEndpoint).pipe(
      switchMap((cartItems) =>
        forkJoin(
          cartItems.map((item) => this.http.delete(`${this.cartEndpoint}/${item.id}`))
        )
      ),
      tap(() => this.cartSubject.next([]))
    );
  }

  getCartObservable(): Observable<any[]> {
    return this.cartSubject.asObservable();
  }
}
