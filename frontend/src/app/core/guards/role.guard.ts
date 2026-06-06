import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AppRole, AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: AppRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.parseUrl('/login');
    }

    if (authService.hasRole(allowedRoles)) {
      return true;
    }

    return router.parseUrl('/login');
  };
}
