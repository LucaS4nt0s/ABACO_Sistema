import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const push = vi.fn();
const login = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    login,
    token: null,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}));

import LoginPage from './page';

describe('LoginPage', () => {
  it('submits credentials and redirects after login', async () => {
    login.mockResolvedValueOnce('fake-token');

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'maria@exemplo.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'senha-correta' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'maria@exemplo.com',
        senha: 'senha-correta',
      });
      expect(push).toHaveBeenCalledWith('/');
    });
  });
});
