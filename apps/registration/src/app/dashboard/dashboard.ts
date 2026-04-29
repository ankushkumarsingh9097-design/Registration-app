import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">
      <div class="dashboard-card">
        <div class="dashboard-card__icon" aria-hidden="true">✦</div>
        <h1 class="dashboard-card__title">
          Welcome, {{ auth.currentUser()?.fullName }}!
        </h1>
        <p class="dashboard-card__sub">You're successfully signed in.</p>
        <p class="dashboard-card__email">{{ auth.currentUser()?.email }}</p>
        <button
          class="dashboard-card__btn"
          (click)="auth.signOut()"
          id="signout-btn"
        >
          Sign out →
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        overflow: hidden;
      }
      .dashboard-page {
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          135deg,
          #eff6ff 0%,
          #dbeafe 50%,
          #e0f2fe 100%
        );
        padding: 2rem;
      }
      .dashboard-card {
        background: #ffffff;
        border: 1px solid #d1daea;
        border-radius: 16px;
        padding: 2.5rem;
        text-align: center;
        box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
        animation: fadeInUp 0.4s ease both;
        max-width: 400px;
        width: 100%;

        &__icon {
          font-size: 1.4rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 10px;
          margin-bottom: 1rem;
          color: #fff;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
        }
        &__title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.35rem;
        }
        &__sub {
          color: #475569;
          margin-bottom: 0.2rem;
          font-size: 0.875rem;
        }
        &__email {
          color: #2563eb;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        &__btn {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.65rem 1.75rem;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          &:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
          }
        }
      }
    `,
  ],
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
}
