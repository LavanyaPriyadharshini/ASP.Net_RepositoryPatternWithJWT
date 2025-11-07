import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../Environments/Environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';


export interface LoginRequest {
  username: string;
  password: string;
}


export interface LoginResponse {
  token?: string;
  userId: number;
  username: string;
  role: string;
  email: string;
  message?: string;
  success?: boolean;
}


export interface User {
  userId: number;
  username: string;
  role: string;
  email: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // --------------------------------- IMPORTANT -----------------------------
  // NOTES FOR THE ANGULAR COMPONENTS AND SERVICES IS GIVEN IN DETAIL IN MS WORD, CHECK IT OUT THERE, FOR EG WAHT ARE SIGNALS ,WHY SIGNALS ARE USED ETC

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/Auth`;

 // Signals for reactive state
  isAuthenticated = signal(false); // REFER PAGE 1 ms word
  currentUser = signal<User | null>(null); //this holds the currently logged-in user., its value can either be a user object or null
//later in the code we can write as this.currentUser.set({ id: 1, name: 'Lavanya', role: 'Admin' });

   // BehaviorSubject for backwards compatibility
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  // creates a behavioursubject that stored a user object or null
  //this.getUserFromStorage() probably reads from localStorage (to keep the user logged in after page reload).

  public currentUser$ = this.currentUserSubject.asObservable();
  //Converts the BehaviorSubject into a readonly Observable ($ naming convention means “stream”).
//This way, components can subscribe but not directly modify the user.
  
//how behaviour subject is used in the component for later use
// authService.currentUser$.subscribe(user => {
//   console.log("User changed:", user);
// });


  
  constructor() {
    // Check if user is already logged in
    const user = this.getUserFromStorage();
    if (user) {
      this.isAuthenticated.set(true);
      this.currentUser.set(user);
      this.currentUserSubject.next(user);
    }
  }


    private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }





   // Login method matching your backend
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { username, password },
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        console.log('Login response:', response);
        
        if (response && response.token) {
          // Store token
          this.setToken(response.token);
          
          // Decode JWT to get user info
          const userInfo = this.decodeToken(response.token);
          
          if (userInfo) {
            const user: User = {
              userId: parseInt(userInfo.nameid || userInfo.sub || '0'),
              username: userInfo.unique_name || userInfo.name || username,
              role: userInfo.role || 'User',
              email: userInfo.email || ''
            };

            // Store user data
            this.setUserInStorage(user);
            
            // Update signals and subjects
            this.isAuthenticated.set(true);
            this.currentUser.set(user);
            this.currentUserSubject.next(user);
          }
        }
      }),
      catchError(this.handleError)
    );
  }


  // Decode JWT token
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }



   // Logout method
  logout(): void {
    // Clear storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');

    // Update state
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.currentUserSubject.next(null);

    // Navigate to login
    this.router.navigate(['/login']);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }


    // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

    // Get token
  getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }


    // Set token
  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }



  // Store user in localStorage
  private setUserInStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }




  // Get user from localStorage
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }



  // Error handler
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check if the API is running.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (error.status === 404) {
        errorMessage = 'Login endpoint not found.';
      } else if (error.status === 500) {
        errorMessage = error.error?.message || 'Internal Server Error. Please try again later.';
      } else {
        errorMessage = error.error?.message || error.message || `Error Code: ${error.status}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }


}

