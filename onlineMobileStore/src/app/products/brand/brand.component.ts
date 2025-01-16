import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GetProductService } from '../../core/services/product/get-product.service';
import { FormsModule } from '@angular/forms';
import { ProductUtilsService } from '../../core/services/utils/product-utils.service';
import { CartService } from '../../core/services/cart/cart-service.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { LimitWordsPipe } from '../../shared/pipes/limit-words.pipe';

@Component({
  selector: 'app-brand',
  imports: [CommonModule, RouterModule, FormsModule, LimitWordsPipe],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent implements OnInit {
  brandName: string = '';
  groupedProducts: { [brand: string]: any[] } = {}; // Products grouped by brand
  filteredProducts: any[] = []; // Products filtered by the selected brand

  cartItems: any[] = [];
  compareItems: any[] = [];
  wishlistItems: any[] = [];

  constructor(
    private productService: GetProductService,
    private route: ActivatedRoute,
    private productUtils: ProductUtilsService,
    private scroller: ViewportScroller,
    private router: Router,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.route.params.subscribe((params) => {
      this.brandName = params['brandName'];
      this.loadProducts();
    });
  }

  calculateDiscount(psp: number, pop: number): number {
    const discount = ((pop - psp) / pop) * 100;
    return Math.round(discount); // Round to the nearest whole number
  }

  addToCart(product: any) {
    if (this.cartItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToCart(product).subscribe({
      next: () => {
        this.toastr.success(`${product?.pname} added to cart`, 'Success');
        this.getCartItems(); // Refresh cart list
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
        this.getWishlistItems(); // Refresh wishlist list
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

      if (this.brandName) {
        this.filteredProducts = this.groupedProducts[this.brandName] || [];
      }
    });
  }

  getBrands(): string[] {
    return this.productUtils.getBrands(this.groupedProducts);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToBrand(brand: string): void {
    this.productUtils.navigateToBrand(brand);
  }
}
