import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { EmailField } from '../../../../shared/components/email-field/email-field';
import { PasswordField } from '../../../../shared/components/password-field/password-field';
import { PrimaryButton } from '../../../../shared/components/primary-button/primary-button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, EmailField, PasswordField, PrimaryButton],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  form: any;

  loading = false;
  error: string | null = null;
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.error = null;
    this.loading = true;
    this.form.disable();
    const { email, password } = this.form.value as { email: string; password: string };
    this.auth.login(email, password).subscribe({
      next: (res) => {
        localStorage.setItem('abaco_token', res.token);
        // route based on role
        const role = res.role;
        if (role === 'DIRECTOR') {
          this.router.navigate(['/admin/dashboards']);
        } else if (role === 'ADMIN') {
          this.router.navigate(['/admin/alunos']);
        } else if (role === 'TEACHER') {
          this.router.navigate(['/academico/presenca']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.error = err?.message || 'Credenciais inválidas';
        this.loading = false;
        this.form.enable();
      }
    });
  }
}
