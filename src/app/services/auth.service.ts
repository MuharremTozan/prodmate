import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        this.showSuccess(response.message || 'Login successful!');
        sessionStorage.setItem('userId', response.userId);
      }),
      catchError(error => {
        const errorMsg = error.error?.error || 'Login failed!';
        this.showError(errorMsg);
        return throwError(error);
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password }).pipe(
      tap(response => {
        this.showSuccess(response.message || 'Registration successful!');
      }),
      catchError(error => {
        const errorMsg = error.error?.error || 'Registration failed!';
        this.showError(errorMsg);
        return throwError(error);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('userId');
  }
  
  logout(): void {
    sessionStorage.removeItem('userId');
  }

  getUserId(): string | null {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in session storage.');
    }
    return userId;
  }

  public showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  public showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }
}