import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { CandidateFormComponent } from "./app/components/candidate-form/candidate-form.component";
import { provideRouter, Routes } from "@angular/router";

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
  selector: "app-root",
  template: `
    <div class="app-container">
      <h1>Sistema de Registro de Candidatos</h1>
      <app-candidate-form></app-candidate-form>
    </div>
  `,
  styles: [
    `
      .app-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      h1 {
        text-align: center;
        color: #333;
        margin-bottom: 2rem;
      }
    `,
  ],
  standalone: true,
  imports: [CandidateFormComponent],
})
export class App {}

bootstrapApplication(App, {
  providers: [provideHttpClient()],
});
