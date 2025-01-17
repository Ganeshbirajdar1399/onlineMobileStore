import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Users } from './users';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.getUser()
  );
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {}

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get<Users[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map((users) => {
        const user = users[0];
        if (user && user.password === password) {
          const { password: _, ...userWithoutPassword } = user;
          this.setUser(userWithoutPassword);
          this.showSnackbar(
            `${userWithoutPassword.firstName} ${userWithoutPassword.lastName} logged in successfully`,
            3000
          );
          return userWithoutPassword; // Success path
        }
        return null; // Fallback if user is not found or password doesn't match
      })
    );
  }

  register(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiUrl}/users`, user);
  }

  updateUser(updatedUser: any): Observable<any> {
    const url = `${this.apiUrl}/users/${updatedUser.id}`;
    const { password, ...userWithoutPassword } = updatedUser;

    return this.http.put(url, updatedUser).pipe(
      map((response) => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const currentUser = JSON.parse(storedUser);
          if (currentUser.id === updatedUser.id) {
            sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
          }
        }
        return response;
      })
    );
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  deleteUserData(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  setUser(user: any): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  clearUser(): void {
    sessionStorage.removeItem('loggedInUser');
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || '';
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout(): void {
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  fetchUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.apiUrl}/users`);
  }
}
