import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

interface DashboardSummary {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  activeUsers: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);

  summary = signal<DashboardSummary | null>(null);
  error = signal('');
  loading = signal(true);

  constructor() {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get(`${environment.apiUrl}/dashboard/summary`).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        if (response.isSuccess) {
          this.summary.set(response.data);
        } else {
          this.error.set(response.error?.message ?? 'Failed to load dashboard');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load dashboard data');
      }
    });
  }
}
