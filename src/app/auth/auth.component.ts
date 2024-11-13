import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  providers: [ FormBuilder ],
  imports: [ ReactiveFormsModule ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,  
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.authService.showSuccess('Login successful!');
          localStorage.setItem('token', 'dummy-token'); 
          this.router.navigate(['/production-lines']);
        },
        error: () => {
          this.authService.showError('Login failed! Please try again.');
        }
      });
    } else {
      this.authService.showError('Please fill in all fields correctly.');
    }
  }


  onRegister(): void {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService.register(email, password).subscribe({
        next: () => {
          this.authService.showSuccess('Registration successful! You can now log in.');
        },
        error: () => {
          this.authService.showError('Registration failed! Please try again.');
        }
      });
    } else {
      this.authService.showError('Please fill in all fields correctly.');
    }
  }
}