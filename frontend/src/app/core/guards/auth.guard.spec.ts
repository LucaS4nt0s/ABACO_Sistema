import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

class FakeAuthService {
  token: string | null = null;

  hasDirectorAccess() {
    return this.token === 'director-token';
  }
}

describe('authGuard', () => {
  it('allows access for director tokens', () => {
    const authService = new FakeAuthService();
    authService.token = 'director-token';

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: { parseUrl: (url: string) => url } }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBe(true);
  });
});
