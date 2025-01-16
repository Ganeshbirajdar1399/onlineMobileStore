import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { CartService } from '../../core/services/cart/cart-service.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Toastr
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth/auth.service';

interface Product {
  id: string;
  pname: string;
  brand: string;
  description: string;
  color: string;
  image: string;
  disksize: string;
  ram: string;
  psp: number;
  pop: number;
  quantity?: number; // Add quantity field for the cart
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  customer: any = {
    name: '',
    contactNo: '',
    email: '',
    address: '',
    billingAddress: '',
  };

  constructor(
    private globalService: GlobalService,
    private cartService: CartService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotalAmount();

    // Fetch the logged-in user's information when the component is initialized
    const loggedUser = this.authService.getUser();

    if (loggedUser) {
      // Pre-fill the form with logged-in user information
      this.customer.name = loggedUser.firstName + ' ' + loggedUser.lastName;
      this.customer.contactNo = loggedUser.mobile;
      this.customer.email = loggedUser.email;
    }
  }

  placeOrder(): void {
    const loggedUser = this.authService.getUser();

    if (!loggedUser) {
      this.toastr.error('You must be logged in to place an order', 'Error');
      return;
    }
    // Prepare order data with customer information and relevant product details
    const orderData = {
      customer: this.customer,
      userId: loggedUser.id, // Include user ID in the order
      items: this.cartItems.map((item: Product) => ({
        pname: item.pname,
        psp: item.psp,
        quantity: item.quantity,
        ram: item.ram,
        disksize: item.disksize,
      })),
      totalAmount: this.totalAmount,
      orderDate: new Date(),
    };

    // Send order data to GlobalService to place the order
    this.globalService.placeOrder(orderData).subscribe(
      (response) => {
        this.toastr.success('Your order was placed successfully!', 'Success');
        this.clearForm();
        // Clear the cart after placing the order
        this.globalService.clearCart().subscribe(() => {
          this.cartItems = [];
        });

        // Redirect to the orders page after placing the order
        this.router.navigate(['/orders']); // Replace with the appropriate path for orders component
      }
    );
  }

  clearForm() {
    this.customer = {
      name: '',
      contactNo: '',
      email: '',
      address: '',
      billingAddress: '',
    };
  }
}
