import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-updateprofile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css'],
})
export class UpdateprofileComponent {
  loggedInUser: any = null;
  usersData: any[] = [];
  isRegister = false;
  hide = true;

  adminDetails = {
    id: 0,
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    mobile: '',
    address: '',
    role: '',
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

    if (this.loggedInUser) {
      this.authService.getUserById(this.loggedInUser.id).subscribe((userFromDb) => {
        this.adminDetails = {
          id: userFromDb.id,
          firstName: userFromDb.firstName,
          lastName: userFromDb.lastName,
          password: userFromDb.password,
          email: userFromDb.email,
          mobile: userFromDb.mobile,
          address: userFromDb.address || '',
          role: userFromDb.role,
        };
      });
    }
  }

  toggleHide(): void {
    this.hide = !this.hide;
  }

  updateUserDetails(): void {
    if (!this.adminDetails.id) {
      this.toastr.warning('User ID is missing. Please try again.', 'Warning');
      return;
    }

    this.authService.updateUser(this.adminDetails).subscribe(() => {
      this.toastr.success('Profile updated successfully!', 'Success');
      this.router.navigate(['/profile']);
    });
  }

  fetchUsers(): void {
    this.authService.fetchUsers().subscribe((res) => {
      this.usersData = res;
    });
  }
}
