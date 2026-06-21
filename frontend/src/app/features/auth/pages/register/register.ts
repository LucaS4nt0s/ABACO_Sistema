import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { EmailField } from '../../../../shared/components/email-field/email-field';
import { PasswordField } from '../../../../shared/components/password-field/password-field';
import { PrimaryButton } from '../../../../shared/components/primary-button/primary-button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, EmailField, PasswordField, PrimaryButton],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  form: any;

  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]],
      confirmar_senha: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.error = null;
    this.success = null;

    const { nome, email, telefone, senha, confirmar_senha } = this.form.value;

    if (senha !== confirmar_senha) {
      this.error = 'As senhas não conferem';
      return;
    }

    this.loading = true;
    this.form.disable();

    this.auth.register(nome, email, telefone || null, senha, confirmar_senha).pipe(
      finalize(() => {
        this.loading = false;
        this.form.enable();
      })
    ).subscribe({
      next: () => {
        this.success = 'Conta criada com sucesso! Redirecionando para o login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err?.message || 'Erro ao criar conta';
      }
    });
  }
}
