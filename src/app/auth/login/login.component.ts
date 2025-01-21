import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  hide = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private scroller: ViewportScroller
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
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Minimum length
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ), // Must contain uppercase, lowercase, number, special character
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
  }

  onLogin(): void {
    if (this.myForm.valid) {
      const { email, password } = this.myForm.value;

      this.authService.login(email, password).subscribe({
        next: (user) => {
          if (user) {
            this.errorMessage = ''; // Clear any previous error
            this.router.navigate([user.role]);
          }
        },
        error: (err) => {
          // Show an error message in the template
          this.errorMessage = 'Invalid email or password. Please try again.';
        },
      });
    }
  }

  toggleHide() {
    this.hide = !this.hide; // Toggle password visibility
  }
}
