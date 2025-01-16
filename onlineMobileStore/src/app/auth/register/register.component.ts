import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating UUIDs
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  isRegister = false;
  hide = true;

  users = {
    id: '', // Add id field to store UUID
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
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
  }

  toggleHide() {
    this.hide = !this.hide; // Toggle password visibility
  }

  onSubmit() {
    // Generate UUID for the new user
    this.users.id = uuidv4(); // Assign UUID to the user's id field

    // Register the user with the backend (password will be hashed there)
    this.authService.register(this.users).subscribe((res) => {
      console.log('User registered successfully', res);
      this.isRegister = true;
      setTimeout(() => {
        this.isRegister = false;
      }, 2000);
      this.formEmpty();
      this.router.navigate(['/login']);
    });
  }

  formEmpty() {
    this.users = {
      id: '', // Reset the id field
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      address: '',
      role: '', // Reset role if needed
    };
  }
}
