import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Candidate } from "../../models/candidate";
import { CandidateService } from "../../services/candidate.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-candidate-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-table-container">
      <!-- Formulario -->
      <div class="form-container">
        <h2>Registro de Candidatos</h2>
        <form (ngSubmit)="onSubmit()" #candidateForm="ngForm">
          <div class="form-group">
            <label for="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="candidate.name"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="father">Apellido Paterno:</label>
            <input
              type="text"
              id="father"
              name="father"
              [(ngModel)]="candidate.fathersLastName"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="mothers">Apellido Materno:</label>
            <input
              type="text"
              id="mothers"
              name="mothers"
              [(ngModel)]="candidate.mothersLastName"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="clave">Clave de Elector:</label>
            <input
              type="text"
              id="clave"
              name="clave"
              [(ngModel)]="candidate.electoralKey"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="candidate.email"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="charge">Tipo de Cargo:</label>
            <select
              id="charge"
              name="charge"
              [(ngModel)]="candidate.charge"
              (change)="onPositionTypeChange()"
              required
              class="form-control"
            >
              <option value="">Seleccione un tipo</option>
              <option value="magistrados">
                Magistraturas Tribunal Superior de Justicia
              </option>
              <option value="tribunal">
                Magistraturas Tribunal Disciplina Judicial
              </option>
              <option value="juzgado">Juzgados</option>
            </select>
          </div>
          <div class="form-group" *ngIf="candidate.charge">
            <label for="subcharge">Cargo Específico 1:</label>
            <select
              id="subcharge"
              name="subcharge"
              [(ngModel)]="candidate.subcharge"
              (change)="onPositionTypeChange2()"
              required
              class="form-control"
            >
              <option value="">Seleccione un cargo</option>
              <option
                *ngFor="let position of specificPositions"
                [value]="position"
              >
                {{ position }}
              </option>
            </select>
          </div>
          <div
            class="form-group"
            *ngIf="
              candidate.charge !== 'magistrados' &&
              candidate.charge !== 'tribunal' &&
              candidate.subcharge
            "
          >
            <label for="subcharge2">Cargo Específico 2:</label>
            <select
              id="subcharge2"
              name="subcharge2"
              [(ngModel)]="candidate.subcharge2"
              required
              class="form-control"
            >
              <option value="">Seleccione un cargo</option>
              <option *ngFor="let position of subcharge2" [value]="position">
                {{ position }}
              </option>
            </select>
          </div>
          <button
            type="submit"
            [disabled]="!isFormValid()" 
            class="submit-btn"
            (click)="handleSubmit()">
          >
            Enviar
          </button>
        </form>
      </div>

      <!-- Tabla de Registros -->
      <div class="table-container" *ngIf="registeredCandidates.length > 0">
        <h3>Registros Guardados</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Clave de Elector</th>
              <th>Correo</th>
              <th>Tipo de Cargo</th>
              <th>Cargo Específico 1</th>
              <th>Cargo Específico 2</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let candidate of registeredCandidates">
              <td>{{ candidate.name }}</td>
              <td>{{ candidate.fathersLastName }}</td>
              <td>{{ candidate.mothersLastName }}</td>
              <td>{{ candidate.electoralKey }}</td>
              <td>{{ candidate.email }}</td>
              <td>{{ candidate.charge }}</td>
              <td>{{ candidate.subcharge }}</td>
              <td>{{ candidate.subcharge2 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .form-table-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem;
      }
      @media (min-width: 768px) {
        .form-table-container {
          flex-direction: row;
          align-items: flex-start;
        }
      }
      .form-container {
        flex: 1;
        padding: 1.5rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .table-container {
        flex: 2;
        overflow-x: auto;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      .form-control {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .submit-btn {
        background-color: #2c7be5;
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.3s ease;
      }
      .submit-btn:disabled,
      .disabled-btn {
        background-color: #ccc;
        cursor: not-allowed;
      }
      Swal.fire({
  title: "Good job!",
  text: "You clicked the button!",
  icon: "success"
});
      .table {
        width: 100%;
        border-collapse: collapse;
        background: white;
      }
      .table th,
      .table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
      }
      .table th {
        background-color: #2c7be5;
        color: white;
      }
    `,
  ],
})
export class CandidateFormComponent {
  candidate: Candidate = {
    name: "",
    email: "",
    electoralKey: "",
    fathersLastName: "",
    mothersLastName: "",
    charge: "",
    subcharge: "",
    subcharge2: "",
  };

  specificPositions: string[] = [];
  subcharge2: string[] = [];
  showModal: boolean = false;
  registeredCandidates: Candidate[] = []; // Lista de candidatos guardados
  constructor(
    private candidateService: CandidateService,
    private router: Router
  ) {}

  onPositionTypeChange() {
    if (this.candidate.charge === "magistrados") {
      this.specificPositions = [
        "Magistrado de la Primera Sala Penal",
        "Magistrado de la Segunda Sala Penal",
        "Magistrado de la Sala Civil",
        "Magistrado de la Sala Familiar",
      ];
      this.subcharge2 = []; // No hay segunda categoría para magistraturas
      this.candidate.subcharge2 = ""; // Limpia el campo subcharge2
    } else if (this.candidate.charge === "tribunal") {
      this.specificPositions = [
        "Magistrado del Tribunal de Disciplina Judicial",
      ];
    } else if (this.candidate.charge === "juzgado") {
      this.specificPositions = [
        "Penal",
        "Civil",
        "Familiar",
        "Mercantil",
        "Mixto",
      ];
    }

    this.candidate.subcharge = "";
    this.candidate.subcharge2 = ""; // Reinicia la selección
  }

  onPositionTypeChange2() {
    if (this.candidate.subcharge === "Penal") {
      this.subcharge2 = [
        "Sin Dato",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Calera",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Fresnillo",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Jalpa",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Jerez",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Loreto",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Miguel Auza",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Ojocaliente",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Rio Grande",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Tlaltenango",
        "Juzgado de Control y Tribunal de Enjuiciamiento en Zacatecas",
        "Juzgado de Ejecución de Sanciones de Zacatecas",
        "Juzgado Especial de Justicia para Adolescentes de Zacatecas",
        "Juzgado Penal de Sistema de Tradicional de la Región",
        "Juzgado penal del Sistema Tradicional de la Región Norte",
      ];
    } else if (this.candidate.subcharge === "Civil") {
      this.subcharge2 = ["Sin Dato", "Juzgado Primero Civil de Fresnillo"];
    } else if (this.candidate.subcharge === "Familiar") {
      this.subcharge2 = [
        "Sin Dato",
        "Juzgado Primero Familiar de Zacatecas",
        "Juzgado Tercero Familiar de Fresnillo",
      ];
    } else if (this.candidate.subcharge === "Mercantil") {
      this.subcharge2 = [
        "Sin Dato",
        "Juzgado Primero Mercantil de Fresnillo",
        "Juzgado Segundo Mercantil de Fresnillo",
        "Juzgado Tercero Mercantil de Zacatecas",
      ];
    } else if (this.candidate.subcharge === "Mixto") {
      this.subcharge2 = [
        "Sin Dato",
        "Juzgado Mixto de Concepción del Oro",
        "Juzgado Mixto de Miguel Auza",
        "Juzgado Mixto de Teúl de Gonzalez Ortega",
        "Juzgado Mixto de Valparaíso",
        "Juzgado Primero Mixto de Ojocaliente",
        "Juzgado Primero Mixto de Pinos",
        "Juzgado Primero Mixto de Sombrerete",
        "Juzgado Primero Mixto de Calera",
        "Juzgado Primero Mixto de Jalpa",
        "Juzgado Primero Mixto de Pinos",
        "Juzgado Primero Mixto de Rio Grande",
        "Juzgado Primero Mixto de Tlaltenango",
      ];
    }

    this.candidate.subcharge2 = "";
  }

  handleSubmit() {
    if (!this.isFormValid()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes completar al menos Nombre, Clave de Elector y Cargo.",
        footer: '<a href="#">Ver más detalles</a>'
      });
      return;
    }
  
    // Si el formulario es válido, ejecutar la lógica normal de envío
    this.onSubmit();
  }



  isFormValid(): boolean {
    return !!(this.candidate.name && this.candidate.electoralKey && this.candidate.charge);
  }

  onSubmit() {
    console.log("Enviando datos del candidato:", this.candidate);
    this.candidateService.submitCandidate(this.candidate).subscribe(
      (response) => {
        console.log("Candidato enviado exitosamente", response);
        // Redirigir o hacer algo después de la respuesta
        // Guardar en la tabla de registros
        this.registeredCandidates.push({ ...this.candidate });
        // Mostrar mensaje de éxito
        Swal.fire({
          title: "Muy Bien!",
          text: "La información se ha enviado!",
          icon: "success"
        });
        //window.alert("✅ Información enviada correctamente.");
        // Limpiar todos los campos del formulario
        this.candidate = {
          name: "",
          email: "",
          electoralKey: "",
          fathersLastName: "",
          mothersLastName: "",
          charge: "",
          subcharge: "",
          subcharge2: "",
        };
        this.specificPositions = [];
        this.subcharge2 = [];
      },
      (error) => {
        console.error("Error al enviar candidato", error);
      }
    );
  }
}
