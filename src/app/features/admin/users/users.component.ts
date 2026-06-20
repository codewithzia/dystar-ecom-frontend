import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { UserListItem, PaginatedListResponse } from '../../../core/models/user.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);

  users = signal<PaginatedListResponse<UserListItem> | null>(null);
  loading = signal(false);
  error = signal('');

  page = signal(1);
  pageSize = signal(10);
  search = signal('');
  searchQuery = '';

  toggleConfirmOpen = signal(false);
  selectedUser = signal<UserListItem | null>(null);

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set('');

    this.usersService.getUsers(this.page(), this.pageSize(), this.search()).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.isSuccess && response.data) {
          this.users.set(response.data);
        } else {
          this.error.set(response.error?.message ?? 'Failed to load users');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load users');
      }
    });
  }

  onSearch(value: string): void {
    this.searchQuery = value;
    this.search.set(value);
    this.page.set(1);
    this.loadUsers();
  }

  showCount = () => {
    const data = this.users();
    if (!data) return '';
    const start = ((this.page() - 1) * this.pageSize()) + 1;
    const end = Math.min(this.page() * this.pageSize(), data.totalCount);
    return `Showing ${start} - ${end} of ${data.totalCount} users`;
  };

  goToPage(p: number): void {
    if (p < 1 || (this.users() && p > this.users()!.totalPages)) return;
    this.page.set(p);
    this.loadUsers();
  }

  askToggle(user: UserListItem): void {
    this.selectedUser.set(user);
    this.toggleConfirmOpen.set(true);
  }

  confirmToggle(): void {
    const user = this.selectedUser();
    if (!user) return;

    this.toggleConfirmOpen.set(false);
    this.usersService.toggleStatus(user.id).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(`User ${response.data?.isActive ? 'activated' : 'deactivated'} successfully`);
          this.loadUsers();
        } else {
          this.toastService.error(response.error?.message ?? 'Failed to update status');
        }
      },
      error: () => this.toastService.error('Failed to update status')
    });
  }

  cancelToggle(): void {
    this.toggleConfirmOpen.set(false);
    this.selectedUser.set(null);
  }

  pageNumbers = () => {
    const total = this.users()?.totalPages ?? 0;
    const current = this.page();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
}
