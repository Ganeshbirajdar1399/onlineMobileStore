import { Component, OnInit } from '@angular/core';
import { GetProductService } from '../core/services/product/get-product.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductUtilsService } from '../core/services/utils/product-utils.service';
import { GlobalService } from '../core/services/global.service';
import { Webdata } from '../core/services/product/webdata';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  groupedProducts: { [brand: string]: any[] } = {};

  cartItems: any[] = [];
  compareItems: any[] = [];
  wishlistItems: any[] = [];

  webdatas: Webdata[] = [];

  constructor(
    private productService: GetProductService,
    private productUtils: ProductUtilsService,
    private scroller: ViewportScroller,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.loadProducts();
    this.fetchwebdata();
  }

  calculateDiscount(psp: number, pop: number): number {
    const discount = ((pop - psp) / pop) * 100;
    return Math.round(discount); // Round to the nearest whole number
  }

  getRandomProducts(products: any[], count: number = 6): any[] {
    if (!products || products.length <= count) {
      return products; // If there are fewer products, return them all
    }
    const shuffled = [...products].sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Select the first `count` items
  }

  fetchwebdata(): void {
    this.productService.fetchWebData().subscribe((res) => {
      this.webdatas = res;
    });
  }

  // getResponsiveSrcset(imageUrl: string): string {
  //   const baseUrl = imageUrl.substring(0, imageUrl.lastIndexOf('.'));
  //   const extension = imageUrl.substring(imageUrl.lastIndexOf('.'));
  //   return `${baseUrl}-small${extension} 480w, ${baseUrl}-medium${extension} 768w, ${baseUrl}-large${extension} 1200w`;
  // }

  addToCart(product: any) {
    if (this.cartItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToCart(product).subscribe({
      next: () => {
        this.toastr.success(`${product?.pname} added to compare`, 'Success');
        this.getCartItems(); // Refresh compare list
      },
    });
  }

  getCartItems() {
    this.globalService.getCartItems().subscribe({
      next: (res) => {
        this.cartItems = res;
      },
    });
  }

  addToCompare(product: any) {
    if (this.compareItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToCompare(product).subscribe({
      next: () => {
        this.toastr.success(`${product?.pname} added to compare`, 'Success');
        this.getCompareItems(); // Refresh compare list
      },
    });
  }

  getCompareItems() {
    this.globalService.getCompareItems().subscribe({
      next: (res) => {
        this.compareItems = res;
      },
    });
  }

  addToWishlist(product: any) {
    if (this.wishlistItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToWishlist(product).subscribe({
      next: () => {
        this.toastr.success(`${product?.pname} added to wishlist`, 'Success');
        this.getWishlistItems(); // Refresh Wish-list list
      },
    });
  }

  getWishlistItems() {
    this.globalService.getWishlistItems().subscribe({
      next: (res) => {
        this.wishlistItems = res;
      },
    });
  }

  loadProducts(): void {
    this.productService.fetchGroupedByBrand().subscribe((grouped) => {
      this.groupedProducts = grouped;
    });
  }

  getBrands(): string[] {
    return this.productUtils.getBrands(this.groupedProducts);
  }

  navigateToBrand(brand: string): void {
    this.productUtils.navigateToBrand(brand);
  }
}
