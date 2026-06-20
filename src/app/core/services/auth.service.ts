import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResponse, LoginRequest, UserProfile } from '../models/auth.models';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  isAuthenticated$ = new BehaviorSubject<boolean>(!!this.tokenService.getToken());

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => {
          if (response.isSuccess && response.data) {
            this.tokenService.setToken(response.data.accessToken);
            this.tokenService.setUser(response.data.user);
            this.currentUserSubject.next(response.data.user);
            this.isAuthenticated$.next(true);
          }
        })
      );
  }

  me(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/auth/me`)
      .pipe(
        tap(response => {
          if (response.isSuccess && response.data) {
            this.currentUserSubject.next(response.data);
            this.tokenService.setUser(response.data);
          }
        })
      );
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
    this.isAuthenticated$.next(false);
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions?.includes(permission) ?? false;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes(role) ?? false;
  }
}
