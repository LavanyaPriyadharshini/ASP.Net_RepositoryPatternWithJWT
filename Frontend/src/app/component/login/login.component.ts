import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  //injecting the services and packages -- instead of using constructor we are using the inject variable name
private fb = inject(FormBuilder);
private authService = inject(AuthService);
  private router = inject(Router);


//   You can think of a signal like a variable that “tells” the UI:
// “Hey, I’ve changed — please update yourself!”
    // Signals for reactive state
  isLoading = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  rememberMe = signal(false);


  // Login form
  loginForm!: FormGroup;

  // Computed property for form validity
  isFormValid = computed(() => 
    this.loginForm?.valid && !this.isLoading()
  );


    constructor() {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
  }


   ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }

    // Load saved username if "Remember Me" was checked
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      this.loginForm.patchValue({ 
        username: savedUsername,
        rememberMe: true 
      });
      this.rememberMe.set(true);
    }
  }

    // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }


  // Get form control
  getControl(controlName: string) {
    return this.loginForm.get(controlName);
  }


    // Check if field has error
  hasError(controlName: string, errorType: string): boolean {
    const control = this.getControl(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched || this.isSubmitted()));
  }



   // Get error message
  getErrorMessage(controlName: string): string {
    const control = this.getControl(controlName);
    
    if (!control || !(control.dirty || control.touched || this.isSubmitted())) {
      return '';
    }

    if (control.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }

    return '';
  }


    private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      username: 'Username',
      password: 'Password'
    };
    return labels[controlName] || controlName;
  }





    // Handle form submission
  onSubmit(): void {
    this.isSubmitted.set(true);
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading.set(true);

    const { username, password, rememberMe } = this.loginForm.value;

    // Handle "Remember Me"
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', username);
      this.rememberMe.set(true);
    } else {
      localStorage.removeItem('rememberedUsername');
      this.rememberMe.set(false);
    }

    console.log('Attempting login with:', { username }); // Don't log password

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading.set(false);
        
        // Navigate based on user role
        //this.redirectToDashboard();

        this.router.navigate(['/user-creation']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Invalid username or password. Please try again.');
        
        // Clear password field on error
        this.loginForm.patchValue({ password: '' });
      }
    });
    
  }


 // Redirect to appropriate dashboard based on role
  private redirectToDashboard(): void {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      // Route based on role
      switch (user.role) {
        case 'Admin':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'HR':
          this.router.navigate(['/hr/dashboard']);
          break;
        case 'Evaluator':
          this.router.navigate(['/evaluator/dashboard']);
          break;
        case 'Candidate':
          this.router.navigate(['/candidate/dashboard']);
          break;
        default:
          this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  }


   // Navigate to register page
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Navigate to forgot password page
  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }


  
}
