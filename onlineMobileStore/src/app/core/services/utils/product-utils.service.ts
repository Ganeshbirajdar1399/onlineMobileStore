import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductUtilsService {
  constructor(private router: Router) {}
  // Group products by brand
  groupByBrand(products: any[]): { [brand: string]: any[] } {
    return products.reduce((groups, product) => {
      (groups[product.brand] = groups[product.brand] || []).push(product);
      return groups;
    }, {});
  }

  // Extract brand names from grouped products
  getBrands(groupedProducts: { [brand: string]: any[] }): string[] {
    return Object.keys(groupedProducts);
  }

  // Navigate to a specific brand route
  navigateToBrand(brand: string): void {
    this.router.navigate(['/brand', brand]);
  }
}
