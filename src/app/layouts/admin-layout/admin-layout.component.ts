import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import { ToastService } from '../../core/services/toast.service';
import { ToastComponent } from '../../core/components/toast/toast.component';
import { ConfirmDialogComponent } from '../../core/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ToastComponent, ConfirmDialogComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  protected readonly authService = inject(AuthService);
  protected readonly loadingService = inject(LoadingService);
  protected readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  sidebarOpen = signal(true);
  notificationsOpen = signal(false);
  logoutConfirmOpen = signal(false);

  notifications = signal<Notification[]>([
    { id: 1, title: 'New Order', message: 'Order #1234 received', time: '2 min ago', read: false },
    { id: 2, title: 'User Registered', message: 'New user john@example.com', time: '15 min ago', read: false },
    { id: 3, title: 'System Alert', message: 'Database backup completed', time: '1 hour ago', read: true },
    { id: 4, title: 'Payment Received', message: '$250 from Invoice #56', time: '3 hours ago', read: true }
  ]);

  unreadCount = () => this.notifications().filter(n => !n.read).length;

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
  }

  markAsRead(id: number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  askLogout(): void {
    this.logoutConfirmOpen.set(true);
  }

  confirmLogout(): void {
    this.logoutConfirmOpen.set(false);
    this.authService.logout();
    this.toastService.success('Logged out successfully');
    this.router.navigate(['/login']);
  }

  cancelLogout(): void {
    this.logoutConfirmOpen.set(false);
  }
}
