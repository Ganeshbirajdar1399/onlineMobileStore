import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Retrieve expected roles from route data
  const expectedRoles: string[] = route.data?.['role'] || [];
  const userRole = authService.getRole();

  // Check if the user is logged in and their role matches any expected role
  if (!authService.isLoggedIn()) {
    console.warn('Access denied: User is not logged in');
    router.navigate(['/login']); // Navigate to login if not logged in
    return false;
  }

  if (!expectedRoles.includes(userRole)) {
    console.warn(
      `Access denied: User role '${userRole}' does not match required roles: ${expectedRoles.join(
        ', '
      )}`
    );
    router.navigate(['/login']); // Navigate to login if role mismatch
    return false;
  }

  return true; // Grant access
};
