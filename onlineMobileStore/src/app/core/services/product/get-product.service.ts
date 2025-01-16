import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../utils/product';
import { Webdata } from './webdata';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GetProductService {
  private readonly baseUrl = environment.apiUrl; // Fixed base URL
  private readonly productsUrl = `${this.baseUrl}/products`; // Products endpoint
  private readonly webDataUrl = `${this.baseUrl}/otherinfo`; // Web data endpoint

  constructor(private http: HttpClient) {}

  // Fetch all products
  fetchData(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  // Search products
  searchProducts(query: string): Observable<any[]> {
    return this.http.get<any[]>(this.productsUrl).pipe(
      map((products) =>
        products.filter((product) =>
          product.pname.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  // Add product
  addData(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, product);
  }

  // Add web data
  addWebData(webdata: Webdata): Observable<Webdata> {
    return this.http.post<Webdata>(this.webDataUrl, webdata);
  }

  // Fetch all web data
  fetchWebData(): Observable<Webdata[]> {
    return this.http.get<Webdata[]>(this.webDataUrl);
  }

  // Update web data
  updateWebData(id: string, webdata: any): Observable<any> {
    const url = `${this.webDataUrl}/${id}`;
    return this.http.put<any>(url, webdata);
  }

  // Update product data
  updateData(id: string, product: any): Observable<any> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.put<any>(url, product);
  }

  // Delete product
  deleteData(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.productsUrl}/${id}`);
  }

  // Fetch and group products by brand
  fetchGroupedByBrand(): Observable<{ [brand: string]: Product[] }> {
    return this.fetchData().pipe(
      map((products: Product[]) =>
        products.reduce(
          (groups: { [brand: string]: Product[] }, product: Product) => {
            const brand = product.brand;
            (groups[brand] = groups[brand] || []).push(product);
            return groups;
          },
          {}
        )
      )
    );
  }

  // Fetch filtered products by a specific brand
  fetchProductsByBrand(brand: string): Observable<Product[]> {
    return this.fetchGroupedByBrand().pipe(
      map(
        (groupedProducts: { [brand: string]: Product[] }) =>
          groupedProducts[brand] || []
      )
    );
  }
}
