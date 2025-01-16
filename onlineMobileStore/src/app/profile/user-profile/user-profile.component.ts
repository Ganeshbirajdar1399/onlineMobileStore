import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  loggedInUser: any = null;
  usersData: any[] = [];
  isRegister = false;
  user: any = null;
  isaAdmin: boolean = false;
  hide = true;
  private userSubscription!: Subscription;

  users = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    role: 'user',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private scroller: ViewportScroller,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.loggedInUser = this.authService.getUser();
    this.fetchUsers();

    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.user = user;
      this.isaAdmin = user?.role === 'admin';
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleHide(): void {
    this.hide = !this.hide;
  }

  onSubmit(): void {
    if (this.usersData.some((user) => user.email === this.users.email)) {
      this.toastr.warning('Email already exists', 'Warning');
      return;
    }

    this.users.id = uuidv4();
    this.authService.register(this.users).subscribe({
      next: () => {
        this.toastr.success('Admin added successfully', 'Success');
        this.isRegister = true;
        setTimeout(() => (this.isRegister = false), 2000);
        this.formEmpty();
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.toastr.error('Failed to add admin', 'Error');
      },
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
      .subscribe(() => {
        this.authService.deleteUserData(id).subscribe({
          next: () => {
            this.toastr.success('Admin deleted successfully', 'Success');
            this.fetchUsers();
          },
          error: () => {
            this.toastr.error('Failed to delete user', 'Error');
          },
        });
      });
  }

  fetchUsers(): void {
    this.authService.fetchUsers().subscribe((res) => {
      this.usersData = res || [];
    });
  }

  formEmpty(): void {
    this.users = {
      id: '',
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      mobile: '',
      address: '',
      role: 'user',
    };
  }

  get isAdmin(): boolean {
    return this.loggedInUser?.role === 'admin' || false;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
