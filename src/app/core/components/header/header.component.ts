import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetProductService } from '../../services/product/get-product.service';
import { ProductUtilsService } from '../../services/utils/product-utils.service';
import { AuthService } from '../../services/auth/auth.service';
import { GlobalService } from '../../services/global.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  sidebarOpen = false;
  cartCount: number = 0;
  compareCount: number = 0;
  wishlistCount: number = 0;
  groupedProducts: { [brand: string]: any[] } = {};
  loggedInUser: any = null;

  searchQuery: string = '';
  dropdownStates: { [key: string]: boolean } = {};

  //dialog
  isDialogOpen: boolean = false;
  dialogMessage: string = '';

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private productService: GetProductService,
    private productUtils: ProductUtilsService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    // Subscribe to cart changes
    this.globalService.getCartObservable().subscribe((cart) => {
      this.cartCount = cart.length;
    });

    // Subscribe to compare changes
    this.globalService.getCompareObservable().subscribe((compare) => {
      this.compareCount = compare.length; // Count items in compare list
    });

    // Subscribe to wishlist changes
    this.globalService.getWishlistObservable().subscribe((wishlist) => {
      this.wishlistCount = wishlist.length; // Count items in wishlist
    });

    // Handle route changes to manage sidebar state
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sidebarOpen = false;
      }
    });
  }

  ngOnInit(): void {
    // Track the logged-in user
    this.authService.user$.subscribe((user) => {
      this.loggedInUser = user;
      this.cdr.detectChanges(); // Ensure changes are detected
    });

    // Fetch initial product data
    this.fetchData();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery },
      });
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
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
    this.productUtils.navigateToBrand(brand);
  }

  logout(): void {
    this.dialogMessage = 'Are you sure you want to Logout?';
    this.isDialogOpen = true;
  }

  // Handle the user response
  handleConfirmation(confirmed: boolean): void {
    this.isDialogOpen = false;

    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/login']); // Redirect after logout
      this.toastr.success('Logout successfully', 'Success');
    } else {
      this.toastr.info('Logout canceled', 'Info');
    }
  }
}
