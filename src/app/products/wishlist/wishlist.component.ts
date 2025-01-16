import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent {
  wishlistItems: any[] = [];

  constructor(
    private scroller: ViewportScroller,
    private globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.getWishlistItems(); // Fetch wishlist items when the component loads
  }

  // Get all products in the wishlist
  getWishlistItems(): void {
    this.globalService.getWishlistItems().subscribe((res) => {
      this.wishlistItems = res;
    });
  }

  // Remove a single product from the wishlist
  removeFromWishlist(id: string): void {
    this.toastr
      .info(
        'Are you sure you want to delete this product from the wishlist?',
        'Confirm Deletion',
        {
          closeButton: true,
          progressBar: true,
          tapToDismiss: true,
          positionClass: 'toast-top-center',
          timeOut: 0,
          extendedTimeOut: 0,
        }
      )
      .onTap.pipe() // Simplified for example
      .subscribe(() => {
        this.globalService.removeFromWishlist(id).subscribe(() => {
          this.toastr.success('Product removed from wishlist!', 'Success');
          this.getWishlistItems(); // Refresh the wishlist
        });
      });
  }

  // Clear the entire wishlist
  clearWishlist(): void {
    this.toastr
      .info(
        'Are you sure you want to clear the entire wishlist?',
        'Confirm Clear Wishlist',
        {
          closeButton: true,
          progressBar: true,
          tapToDismiss: true,
          positionClass: 'toast-top-center',
          timeOut: 0,
          extendedTimeOut: 0,
        }
      )
      .onTap.pipe() // Simplified for example
      .subscribe(() => {
        this.globalService.clearWishlist().subscribe(() => {
          this.toastr.success('Wishlist has been cleared!', 'Success');
          this.getWishlistItems(); // Refresh the wishlist
        });
      });
  }
}
