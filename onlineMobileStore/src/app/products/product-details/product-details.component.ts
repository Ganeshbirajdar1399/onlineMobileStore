import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProductService } from '../../core/services/product/get-product.service';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: any; // Assuming this is fetched from your product service
  showPopup: boolean = false; // Control the popup visibility
  cartItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: GetProductService,
    private scroller: ViewportScroller,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    const productId = this.route.snapshot.paramMap.get('id'); // Get product ID from route
    this.loadProduct(productId!);
  }

  // Calculate discount percentage
  calculateDiscount(psp: number, pop: number): number {
    const discount = ((pop - psp) / pop) * 100;
    return Math.round(discount); // Round to the nearest whole number
  }

  // Load product details by ID
  loadProduct(productId: string): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.product = products.find((p) => p.id === productId);

      if (!this.product) {
        console.error(`Product with ID ${productId} not found.`);
      }
    });
  }

  // Add product to the cart
  addToCart(product: any) {
    if (this.cartItems.some((item) => item.id === product.id)) {
      this.toastr.warning('This product is already in the cart list!', 'Warning');
      return;
    }

    this.globalService.addToCart(product).subscribe(() => {
      this.toastr.success(`${product?.pname} added to cart`, 'Success');
      this.getCartItems(); // Refresh cart list
    });
  }

  // Fetch cart items
  getCartItems() {
    this.globalService.getCartItems().subscribe((res) => {
      this.cartItems = res;
    });
  }
}
