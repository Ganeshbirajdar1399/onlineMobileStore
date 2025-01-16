import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GetProductService } from '../../core/services/product/get-product.service';
import { LimitWordsPipe } from '../../shared/pipes/limit-words.pipe';
import { ProductUtilsService } from '../../core/services/utils/product-utils.service';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-productsearch',
  imports: [RouterModule, CommonModule, FormsModule, LimitWordsPipe],
  templateUrl: './productsearch.component.html',
  styleUrls: ['./productsearch.component.css'],
})
export class ProductsearchComponent implements OnInit {
  brandName: string = '';
  groupedProducts: { [brand: string]: any[] } = {}; // Products grouped by brand
  filteredProducts: any[] = []; // Products filtered by the selected brand

  cartItems: any[] = [];
  compareItems: any[] = [];
  wishlistItems: any[] = [];

  searchQuery: string = '';
  products: any[] = []; // All products fetched from the service

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

    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.fetchProducts();
      }
    });
  }

  // Calculate discount percentage
  calculateDiscount(psp: number, pop: number): number {
    const discount = ((pop - psp) / pop) * 100;
    return Math.round(discount); // Round to the nearest whole number
  }

  // Fetch products based on search query
  fetchProducts() {
    this.productService.searchProducts(this.searchQuery).subscribe((data: any) => {
      this.products = data;
    });
  }

  // Clear search results
  clearSearch() {
    this.searchQuery = '';
    this.products = []; // Clear products if needed
  }

  // Add product to the cart
  addToCart(product: any) {
    if (this.cartItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToCart(product).subscribe(() => {
      this.toastr.success(`${product?.pname} added to cart`, 'Success');
      this.getCartItems(); // Refresh cart list
    });
  }

  // Get all products in the cart list
  getCartItems() {
    this.globalService.getCartItems().subscribe((res) => {
      this.cartItems = res;
    });
  }

  // Add product to compare list
  addToCompare(product: any) {
    if (this.compareItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToCompare(product).subscribe(() => {
      this.toastr.success(`${product?.pname} added to compare`, 'Success');
      this.getCompareItems(); // Refresh compare list
    });
  }

  // Get all products in the compare list
  getCompareItems() {
    this.globalService.getCompareItems().subscribe((res) => {
      this.compareItems = res;
    });
  }

  // Add product to wishlist
  addToWishlist(product: any) {
    if (this.wishlistItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the list!', 'Warning');
      return;
    }

    this.globalService.addToWishlist(product).subscribe(() => {
      this.toastr.success(`${product?.pname} added to wishlist`, 'Success');
      this.getWishlistItems(); // Refresh wishlist
    });
  }

  // Get all products in the wishlist
  getWishlistItems() {
    this.globalService.getWishlistItems().subscribe((res) => {
      this.wishlistItems = res;
    });
  }

  // Load products grouped by brand
  loadProducts(): void {
    this.productService.fetchGroupedByBrand().subscribe((grouped) => {
      this.groupedProducts = grouped;

      if (this.brandName) {
        this.filteredProducts = this.groupedProducts[this.brandName] || [];
      }
    });
  }

  // Get available brands
  getBrands(): string[] {
    return this.productUtils.getBrands(this.groupedProducts);
  }

  // Navigate to cart
  goToCart() {
    this.router.navigate(['/cart']);
  }

  // Navigate to main page
  goToMain() {
    this.router.navigate(['']);
  }

  // Navigate to a specific brand's page
  navigateToBrand(brand: string): void {
    this.productUtils.navigateToBrand(brand);
  }
}
