import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';

class FakeAuthService {
  token: string | null = null;

  hasDirectorAccess() {
    return this.token === 'director-token';
  }
}

describe('roleGuard', () => {
  it('allows access for director tokens', () => {
    const authService = new FakeAuthService();
    authService.token = 'director-token';

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: { parseUrl: (url: string) => url } },
      ],
    });

    const result = TestBed.runInInjectionContext(() => roleGuard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('redirects non director to login', () => {
    const authService = new FakeAuthService();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: { parseUrl: (url: string) => url } },
      ],
    });

    const result = TestBed.runInInjectionContext(() => roleGuard({} as never, {} as never));

    expect(result).toBe('/login');
  });
});
