import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);

  summary: { totalUsers: number; totalRoles: number; totalPermissions: number; activeUsers: number } | null = null;
  error = '';
  loading = true;

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.http.get(`${environment.apiUrl}/dashboard/summary`).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.isSuccess) {
          this.summary = response.data;
        } else {
          this.error = response.error?.message ?? 'Failed to load dashboard';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load dashboard data';
      }
    });
  }
}
