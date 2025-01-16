import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  emptyCart = '';
  totalAmount: number = 0;

  constructor(
    private viewportScroller: ViewportScroller,
    private globalService: GlobalService,
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.getCartItem();
  }

  getCartItem(): void {
    this.globalService.getCartItems().subscribe({
      next: (res) => {
        this.cartItems = res.map((item) => ({
          ...item,
          quantity: item.quantity ?? 1,
        }));
        this.recalculateTotal();
      },
    });
  }

  removeItem(id: string): void {
    this.toastr
      .info('Are you sure you want to delete this product?', 'Confirm Deletion', {
        closeButton: true,
        progressBar: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        timeOut: 0,
        extendedTimeOut: 0,
      })
      .onTap.subscribe(() => {
        // Proceed with deletion
        this.globalService.removeFromCart(id).subscribe({
          next: () => {
            this.toastr.success('Product removed from cart!', 'Success');
            this.getCartItem(); // Refresh the cart
          },
          error: (err) => {
            console.error('Error removing product:', err);
            this.toastr.error('Failed to remove product from cart', 'Error');
          },
        });
      });
  }
  
  clearCart(): void {
    this.toastr
      .info('Are you sure you want to clear the entire cart?', 'Confirm Clear Cart', {
        closeButton: true,
        progressBar: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        timeOut: 0,
        extendedTimeOut: 0,
      })
      .onTap.subscribe(() => {
        // Proceed with clearing the cart
        this.globalService.clearCart().subscribe({
          next: () => {
            this.toastr.success('Cart has been cleared!', 'Success');
            this.getCartItem(); // Refresh the cart
          },
          error: (err) => {
            console.error('Error clearing cart:', err);
            this.toastr.error('Failed to clear the cart', 'Error');
          },
        });
      });
  }
  

  getTotal(): number {
    return this.globalService.getTotal();
  }

  onQuantityChange(item: any): void {
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    this.recalculateTotal();
  }

  recalculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.psp * item.quantity,
      0
    );
  }

  goToCheckout(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.setCartItems(this.cartItems, this.totalAmount);
      this.router.navigate(['/checkout']);
    } else {
      this.snackBar.open('Please log in to proceed to checkout', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.router.navigate(['/login']);
    }
  }
}
