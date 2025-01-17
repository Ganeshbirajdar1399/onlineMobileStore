import { Component } from '@angular/core';
import { GlobalService } from '../../core/services/global.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchOrderPipe } from '../../shared/pipes/search-order.pipe';
interface Order {
  id: string;
  userId: string;
  customer: {
    name: string;
    email: string;
    contactNo: string;
    address: string;
    billingAddress: string;
    status: string;
  };
  orderDate: string;
  totalAmount: number;
  items: {
    pname: string;
    ram: string;
    disksize: string;
    quantity: number;
    psp: number;
  }[];
}
@Component({
  selector: 'app-user-orders',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SearchOrderPipe,
  ],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css',
})
export class UserOrdersComponent {
  allOrders: Order[] = [];
  filteredOrders: any[] = [];
  isSubmit = false;

  searchText: string = '';
  page = 1;
  itemsPerPage = 10;
  loggedInUser: any = null;

  //dialog
  isDialogOpen: boolean = false;
  dialogMessage: string = '';
  subscriberIdToDelete: string = ''; // Store the subscriber ID to be deleted

  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
    private toastr: ToastrService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.fetchOrders();
    this.loggedInUser = this.authService.getUser(); // Fetch user data
  }

  fetchOrders(): void {
    this.globalService.fetchOrders().subscribe((res) => {
      this.allOrders = res;

      // Filter orders by user ID
      if (this.loggedInUser?.id) {
        this.filteredOrders = this.allOrders.filter(
          (order) => order.userId === this.loggedInUser.id
        );
      } else {
        this.filteredOrders = this.allOrders;
      }
    });
  }

  deleteOrders(id: string): void {
    this.subscriberIdToDelete = id; // Store the ID for later use
    this.dialogMessage = 'Are you sure you want to delete this order?';
    this.isDialogOpen = true;
  }
  // Handle the user response
  handleConfirmation(confirmed: boolean): void {
    this.isDialogOpen = false;

    if (confirmed) {
      this.globalService.deleteOrder(this.subscriberIdToDelete).subscribe(
        () => {
          this.toastr.success('Order Deleted successfully!', 'Success');
          this.fetchOrders();
        },
        () => this.toastr.error('Failed to delete Order.', 'Error')
      );
    } else {
      this.toastr.info('Order deletion canceled', 'Info');
    }
  }

  // deleteOrders(id: string): void {
  //   this.toastr
  //     .info('Are you sure you want to delete this order?', 'Confirm Deletion', {
  //       closeButton: true,
  //       progressBar: true,
  //       tapToDismiss: true,
  //       positionClass: 'toast-top-center',
  //       timeOut: 0,
  //       extendedTimeOut: 0,
  //     })
  //     .onTap.pipe()
  //     .subscribe({
  //       next: () => {
  //         this.globalService.deleteOrder(id).subscribe(() => {
  //           this.toastr.success('Order Deleted successfully!', 'Success');
  //           this.fetchOrders(); // Refresh orders list
  //         });
  //       },
  //     });
  // }

  get isAdmin(): boolean {
    return this.loggedInUser?.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Check if the user is logged in
  }
}
