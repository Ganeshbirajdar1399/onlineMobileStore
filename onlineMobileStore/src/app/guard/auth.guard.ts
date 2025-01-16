import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const userRole = authService.getRole();
  const currentUrl = state.url;

  // Redirect logged-in users away from login and register pages
  if (isLoggedIn && (currentUrl === '/login' || currentUrl === '/register')) {
    router.navigate([`/${userRole}`]); // Redirect to role-based route
    return false;
  }

  // Allow non-logged-in users to access login and register pages
  if (!isLoggedIn && (currentUrl === '/login' || currentUrl === '/register')) {
    return true;
  }

  // Restrict non-logged-in users from accessing other routes
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true; // Allow logged-in users to access non-restricted routes
};
