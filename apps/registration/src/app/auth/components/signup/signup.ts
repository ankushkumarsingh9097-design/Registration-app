import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly showPass = signal(false);
  readonly showConfirm = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly passStrength = signal(0);

  readonly form: FormGroup = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    },
    { validators: this.passwordMatchValidator },
  );

  field(name: string): AbstractControl {
    const ctrl = this.form.get(name);
    if (!ctrl) throw new Error(`Form control "${name}" not found`);
    return ctrl;
  }

  get mismatch() {
    return (
      this.form.hasError('passwordMismatch') &&
      !!this.field('confirmPassword')?.touched
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    if (!password || !confirm) return null;
    return password.value === confirm.value ? null : { passwordMismatch: true };
  }

  onPasswordInput(): void {
    const val = (this.field('password')?.value ?? '') as string;
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9!@#$%^&*]/.test(val)) score++;
    this.passStrength.set(score);
  }

  togglePassword(): void {
    this.showPass.update((v) => !v);
  }
  toggleConfirm(): void {
    this.showConfirm.update((v) => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMsg.set(null);

    const { fullName, email, password, terms } = this.form.value as {
      fullName: string;
      email: string;
      password: string;
      terms: boolean;
    };

    console.log('Full Form Data:', {
      fullName,
      email,
      password,
      termsAccepted: terms,
    });

    this.auth.signUp({ fullName, email, password, terms }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: { message: string }) => {
        this.isLoading.set(false);
        this.errorMsg.set(
          err.message ?? 'Registration failed. Please try again.',
        );
      },
    });
  }

  strengthLabel(): string {
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.passStrength()];
  }

  strengthClass(): string {
    return ['', 'weak', 'fair', 'good', 'strong'][this.passStrength()];
  }
}
