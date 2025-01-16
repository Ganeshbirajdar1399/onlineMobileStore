import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GetProductService } from '../../services/product/get-product.service';
import { ProductUtilsService } from '../../services/utils/product-utils.service';
import { CartService } from '../../services/cart/cart-service.service';
import { Webdata } from '../../services/product/webdata';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  cartCount: number = 0;

  webdatas: Webdata[] = [];
  groupedProducts: { [brand: string]: any[] } = {};

  myForm: FormGroup;

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: GetProductService,
    private productUtils: ProductUtilsService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {
    this.myForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email, // Validates the email format
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ), // Ensures stricter email validation
        ],
      ],
    });

    // Subscribe to cart changes
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  postSubscribe() {
    if (this.myForm.valid) {
      const subscribe = {
        ...this.myForm.value,
      };

      this.globalService.postSubscribe(subscribe).subscribe((response) => {
        this.toastr.success('Thanks for subscribing', 'Success');
        console.log('Subscribe successfully:', response);
        this.myForm.reset();
      });
    }
  }

  ngOnInit(): void {
    this.fetchData();
    this.fetchWebData();
  }

  fetchWebData(): void {
    this.productService.fetchWebData().subscribe((res) => {
      this.webdatas = res || []; // Fallback to empty array if `res` is null/undefined
    });
  }

  fetchData(): void {
    this.productService.fetchData().subscribe((products: any[]) => {
      this.groupedProducts = this.productUtils.groupByBrand(products);
    });
  }

  getBrands(): string[] {
    return this.productUtils.getBrands(this.groupedProducts);
  }

  navigateToBrand(brand: string): void {
    this.router.navigate(['/brand', brand]); // Navigate to the route with the brand name
  }
}
