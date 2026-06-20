import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.models';
import { PaginatedListResponse, UserListItem } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(page = 1, pageSize = 10, search = ''): Observable<ApiResponse<PaginatedListResponse<UserListItem>>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search) params = params.set('search', search);

    return this.http.get<ApiResponse<PaginatedListResponse<UserListItem>>>(`${this.apiUrl}/users`, { params });
  }

  toggleStatus(id: string): Observable<ApiResponse<{ isActive: boolean }>> {
    return this.http.post<ApiResponse<{ isActive: boolean }>>(`${this.apiUrl}/users/${id}/toggle-status`, {});
  }

  getRoles(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/users/roles`);
  }

  updateRoles(id: string, roles: string[]): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/users/${id}/roles`, roles);
  }
}
