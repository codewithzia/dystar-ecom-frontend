import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Users</h1>
      <p class="text-gray-600">User management module coming soon.</p>
    </div>
  `
})
export class UsersComponent {}
