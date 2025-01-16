import { Component } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { SearchUserPipe } from '../../shared/pipes/search-user.pipe';

@Component({
  selector: 'app-customers',
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SearchUserPipe,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  users: any[] = [];
  loggedInUser: any = null;

  searchText: string = '';

  page = 1;
  itemsPerPage = 20;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.authService.fetchUsers().subscribe((res) => {
      this.users = res.filter((user) => user.role === 'user');
    });
  }

  deleteUser(id: string): void {
    this.toastr
      .info('Click to confirm deletion', 'Confirm Delete', {
        closeButton: true,
        progressBar: true,
        tapToDismiss: true,
        positionClass: 'toast-top-center',
        timeOut: 0,
        extendedTimeOut: 0,
      })
      .onTap.pipe(take(1))
      .subscribe({
        next: () => {
          this.authService.deleteUserData(id).subscribe(() => {
            this.toastr.success('User deleted successfully', 'Success');
            this.fetchUsers(); // Refresh user list
          });
        },
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
