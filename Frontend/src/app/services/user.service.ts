import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../Environments/Environment';
import { UserCreateRequest } from '../models/user';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

private http =inject(HttpClient);

private apiurl=`${environment.apiUrl}/Auth`

  private authService = inject(AuthService);

    private router = inject(Router); // ✅ Inject router at class level



  
 private getHeaders(): HttpHeaders {
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Add token if available
    const token = this.authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }
  
  
 
   //here "usercreaterequest" is the model created in the Models/user folder
   //here we are calling the model class properties
  addUser(user:UserCreateRequest):Observable<any>{
    return this.http.post<any>(
      `${this.apiurl}/AddUser`,
      user,
      {headers:this.getHeaders()}
    ).pipe(
      catchError(this.handleError.bind(this)) // ✅ Bind 'this' context
    );
  }



  //this code is for logging in  - the entire login functionality is given in the auth.service.ts code
  
  //  Login(username:string,password:string):Observable<any>{   
  //   return this.http.post<any>(
  //     `${this.apiurl}/login` , {username,password}, {headers:this.getHeaders()}
  //   ). pipe
  //   (
  //     catchError(this.handleError)
  //   );

  //  }


 private handleError(error: HttpErrorResponse) {
  console.error('API Error:', error);
  let errorMessage = 'An error occurred while processing your request.';
  
  if (error.error instanceof ErrorEvent) {
    errorMessage = `Error: ${error.error.message}`;
  } else {
    if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check if the API is running.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || error.error || 'Bad Request - Invalid data submitted.';
    } else if (error.status === 401) {
      errorMessage = 'Sorry, you dont have access to Create an User Account.';
       
    } else if (error.status === 403) {
      // Navigate to access denied page
      const router = inject(Router);
      router.navigate(['/access-denied']);
      errorMessage = 'Access Denied - You do not have permission to perform this action.';
    } else if (error.status === 404) {
      errorMessage = 'API endpoint not found.';
    } else if (error.status === 500) {
      errorMessage = error.error?.message || error.error || 'Internal Server Error - Please try again later.';
    } else {
      errorMessage = error.error?.message || error.error || error.message || `Error Code: ${error.status}`;
    }
  }
  
  return throwError(() => new Error(errorMessage));
}
  
}
