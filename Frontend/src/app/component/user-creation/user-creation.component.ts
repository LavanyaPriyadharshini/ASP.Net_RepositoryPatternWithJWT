import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserCreateRequest } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-creation',
    standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-creation.component.html',
  styleUrl: './user-creation.component.css'
})
export class UserCreationComponent {

  
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
    private authService = inject(AuthService); // ✅ Added AuthService



  // Signals for reactive state management
  isLoading = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  pageMode = signal<'register' | 'admin'>('register'); // register or admin mode



    // Roles dropdown
  roles = signal([
    { value: 'Admin', label: 'Administrator' },
    { value: 'HR', label: 'HR Manager' },
    { value: 'Evaluator', label: 'Test Evaluator' },
    { value: 'Candidate', label: 'Candidate' },
    { value: 'User', label: 'Regular User' }
  ]);

   // Form Group
  userForm!: FormGroup;

   // Computed for form validity
  isFormValid = computed(() => 
    this.userForm?.valid && !this.isLoading()
  );


 constructor() {
    this.userForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]*$/)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      contactNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required],
      role: ['User', Validators.required] // Default to 'User'
    }, { 
      validators: this.passwordMatchValidator 
    });
  }





  ngOnInit(): void {
    // Check if coming from admin panel or public registration
    this.route.data.subscribe(data => {
      if (data['mode'] === 'admin') {
        this.pageMode.set('admin');
      }
    });
  }


  // Custom Validators
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(show => !show);
  }

  // Get form control for template
  getControl(controlName: string) {
    return this.userForm.get(controlName);
  }

  // Check if field has error
  hasError(controlName: string, errorType: string): boolean {
    const control = this.getControl(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched || this.isSubmitted()));
  }

  // Get error message for field
  getErrorMessage(controlName: string): string {
    const control = this.getControl(controlName);
    
    if (!control || !(control.dirty || control.touched || this.isSubmitted())) {
      return '';
    }

    if (control.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    if (control.hasError('pattern')) {
      return this.getPatternErrorMessage(controlName);
    }
    if (control.hasError('passwordStrength')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }

    return '';
  }



  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      username: 'Username',
      email: 'Email',
      contactNumber: 'Contact Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      role: 'Role'
    };
    return labels[controlName] || controlName;
  }

  private getPatternErrorMessage(controlName: string): string {
    switch (controlName) {
      case 'contactNumber':
        return 'Please enter a valid 10-digit contact number';
      case 'username':
        return 'Username can only contain letters, numbers, and underscores';
      default:
        return 'Invalid format';
    }
  }

  // Form submission
  onSubmit() {
    this.isSubmitted.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.userForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading.set(true);

    const formValue = this.userForm.value;
    
    // Prepare request matching your API structure
    const userRequest: UserCreateRequest = {
      userId: 0, // For new user, backend will assign ID
      username: formValue.username.trim(),
      password: formValue.password,
      role: formValue.role,
      email: formValue.email.trim().toLowerCase(),
      contactNumber: parseInt(formValue.contactNumber, 10),
      date: new Date().toISOString() // Current date in ISO format
    };

    console.log('Creating user:', userRequest);

    this.userService.addUser(userRequest).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log('User created successfully:', response);
        
        this.successMessage.set('User registered successfully!');
        this.userForm.reset();
        this.isSubmitted.set(false);
        
        // Navigate based on mode
        setTimeout(() => {
          if (this.pageMode() === 'admin') {
            this.router.navigate(['/admin/users']);
          } else {
            this.router.navigate(['/login']);
          }
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'An error occurred while creating user');
        console.error('User creation error:', error);
      }
    });
  }

  // Reset form
  onReset() {
    this.userForm.reset({
      role: 'User' // Reset to default role
    });
    this.isSubmitted.set(false);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  // Cancel and navigate back
  onCancel() {
    if (this.pageMode() === 'admin') {
      this.router.navigate(['/admin/users']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Navigate to login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}


