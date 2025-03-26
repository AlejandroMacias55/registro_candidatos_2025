import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { CandidateFormComponent } from "./app/components/candidate-form/candidate-form.component";
import { provideRouter, Routes } from "@angular/router";
import { LoginComponent } from "./app/components/login/login";
import { AuthService } from './app/services/auth.service';
import { CommonModule } from '@angular/common';



const routes: Routes = [
  {
    path: "captura_candidatura",
    loadComponent: () =>
      import("./app/components/candidate-form/candidate-form.component").then(
        (m) => m.CandidateFormComponent
      ),
  },
  { path: "**", redirectTo: "captura_candidatura", pathMatch: "full" }, // Bloquea otras rutas
];

bootstrapApplication(CandidateFormComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <ng-container *ngIf="(authService.getAuthState() | async)?.isAuthenticated; else loginTemplate">
        <h1>Sistema de Registro de Candidatos</h1>
        <div class="header">
          <span class="welcome-text">
            Bienvenido {{ (authService.getAuthState() | async)?.user?.username }}
          </span>
          <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
          
        </div>
        <app-candidate-form></app-candidate-form>
      </ng-container>
      <ng-template #loginTemplate>
        <app-login></app-login>
      </ng-template>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #f8f9fa;
      margin-bottom: 2rem;
    }
    .welcome-text {
      font-size: 1.1rem;
      color: #333;
    }
    .logout-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .excel-btn {
      background-color:rgb(15, 105, 30);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    h1 {
      text-align: center;
      color: #333;
      margin: 2rem 0;
    }
  `],
  standalone: true,
  imports: [CommonModule, CandidateFormComponent, LoginComponent]
})
export class App {

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
    
  }


 }


bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    AuthService
  ]
});