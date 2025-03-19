import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AuthService } from "../../services/auth.service";
import { LoginRequest } from '../../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Bienvenido al Sistema</h2>
        <p class="login-subtitle">Por favor, inicie sesión para continuar</p>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="credentials.username"
              required
              class="form-control"
              placeholder="Ingrese su usuario"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              class="form-control"
              placeholder="Ingrese su contraseña"
            />
          </div>

          <button type="submit" [disabled]="!loginForm.form.valid || isLoading" class="login-btn">
            {{ isLoading ? 'Iniciando sesión...' : 'Ingresar al Sistema' }}
          </button>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .login-box {
      background: white;
      padding: 2.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    .login-subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 0.5rem;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    .login-btn {
      width: 100%;
      background-color: #007bff;
      color: white;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    .login-btn:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .login-btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    .error-message {
      color: #dc3545;
      margin-top: 1rem;
      text-align: center;
      padding: 0.5rem;
      background-color: #fff3f3;
      border-radius: 4px;
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}