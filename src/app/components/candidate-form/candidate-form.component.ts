import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../models/candidate';
import { CandidateService } from '../../services/candidate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
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
          <label for="name">Apellido Paterno:</label>
          <input
            type="father"
            id="father"
            name="father"
            [(ngModel)]="candidate.fathersLastName"
            required
            class="form-control"
          />
        </div>

        
        <div class="form-group">
          <label for="name">Apellido Materno:</label>
          <input
            type="mothers"
            id="mothers"
            name="mothers"
            [(ngModel)]="candidate.mothersLastName"
            required
            class="form-control"
          />
          <label for="name">Clave de Elector</label>
          <input
            type="clave"
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
            <option value="magistrados"> Magistraturas Tribunal Superior de Justicia</option>
            <option value="tribunal">Magistraturas Tribunal Disciplina Judicial</option>
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
            <option *ngFor="let position of specificPositions" [value]="position">
              {{ position }}
            </option>
          </select>
        </div>

        
        <div class="form-group" *ngIf="candidate.charge !== 'magistrados' && candidate.charge !== 'tribunal' && candidate.subcharge">
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
        

        <button type="submit" [disabled]="!candidateForm.form.valid" class="submit-btn">
          Enviar Solicitud
        </button>
      </form>
      
      <!-- Tabla de Registros -->
      <div *ngIf="registeredCandidates.length > 0" class="table-container">
          <h3>Registros Guardados</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Clave de Elector</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let candidate of registeredCandidates">
                <td>{{ candidate.name }}</td>
                <td>{{ candidate.fathersLastName }}</td>
                <td>{{ candidate.mothersLastName }}</td>
                <td>{{ candidate.electoralKey }}</td>
                <td>{{ candidate.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: flex;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .form-control {
      
      width: 30%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-top: 0.5rem;
    }
    
    
    .form-table-container {
      display: flex;
      justify-content: space-between;
    }

    

    .table-container {
      width: 50%;
      margin-left: 20px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th, .table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }

    .table th {
      background-color:rgb(114, 174, 238);
      color: white;
    }

    .submit-btn {
      background-color:rgb(61, 136, 86);
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem; 
      
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
    }

    .modal-content button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color:rgb(49, 75, 80);
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

  `]
})
export class CandidateFormComponent {
  candidate: Candidate = {
    name: '',
    email: '',
    electoralKey: '',
    fathersLastName: '',
    mothersLastName: '',
    charge: '',
    subcharge: '', 
    subcharge2: ''
  };

  specificPositions: string[] = [];
  subcharge2: string[] = [];
  showModal: boolean = false;
  registeredCandidates: Candidate[] = []; // Lista de candidatos guardados
  constructor(private candidateService: CandidateService, private router: Router) {}

  


  // onPositionTypeChange() {
  //   if (this.candidate.charge === 'magistrados') {
  //     this.specificPositions = [
  //       'Magistrado de la Primera Sala Penal',
  //       'Magistrado de la Segunda Sala Penal',
  //       'Magistrado de la Sala Civil',
  //       'Magistrado de la Sala Familiar',
  //     ];
  //   } else if (this.candidate.charge === 'tribunal') {
  //     this.specificPositions = [
  //       'Magistrado del Tribunal de Disciplina Judicial',
  //     ];
  //   }
  //   else if (this.candidate.charge === 'juzgado') {
  //     this.specificPositions = [
  //       'Penal',
  //       'Civil',
  //       'Familiar',
  //       'Mercantil',
  //       'Mixto'
  //     ];
  //   }
  //   this.candidate.subcharge = '';
  //   //this.candidate.subcharge2 = '';
  // }
  onPositionTypeChange() {
    if (this.candidate.charge === 'magistrados' ) {
      this.specificPositions = [
        'Magistrado de la Primera Sala Penal', 
        'Magistrado de la Segunda Sala Penal',
        'Magistrado de la Sala Civil',
        'Magistrado de la Sala Familiar'
      ];
      this.subcharge2 = []; // No hay segunda categoría para magistraturas
      this.candidate.subcharge2 = ''; // Limpia el campo subcharge2
    }else if (this.candidate.charge === 'tribunal') {
      this.specificPositions = ['Magistrado del Tribunal de Disciplina Judicial'];
    } 
    else if (this.candidate.charge === 'juzgado') {
      this.specificPositions = ['Penal', 'Civil', 'Familiar', 'Mercantil', 'Mixto'];
    }

    this.candidate.subcharge = '';
    this.candidate.subcharge2 = ''; // Reinicia la selección
  }

  onPositionTypeChange2() {
      if (this.candidate.subcharge=== 'Penal') {
      this.subcharge2 = [
        'Sin Dato',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Calera',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Fresnillo',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Jalpa',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Jerez',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Loreto',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Miguel Auza',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Ojocaliente',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Rio Grande',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Tlaltenango',
        'Juzgado de Control y Tribunal de Enjuiciamiento en Zacatecas',
        'Juzgado de Ejecución de Sanciones de Zacatecas',
        'Juzgado Especial de Justicia para Adolescentes de Zacatecas',
        'Juzgado Penal de Sistema de Tradicional de la Región',
        'Juzgado penal del Sistema Tradicional de la Región Norte',
      ];
    }else if (this.candidate.subcharge=== 'Civil') {
      this.subcharge2 = [
        'Sin Dato',
        'Juzgado Primero Civil de Fresnillo',
      ];
    }
    else if (this.candidate.subcharge=== 'Familiar') {
      this.subcharge2 = [
        'Sin Dato',
        'Juzgado Primero Familiar de Zacatecas',
        'Juzgado Tercero Familiar de Fresnillo',
      ];
    }
    else if (this.candidate.subcharge=== 'Mercantil') {
      this.subcharge2 = [
        'Sin Dato',
        'Juzgado Primero Mercantil de Fresnillo',
        'Juzgado Segundo Mercantil de Fresnillo',
        'Juzgado Tercero Mercantil de Zacatecas',
      ];
    }
    else if (this.candidate.subcharge=== 'Mixto') {
      this.subcharge2 = [
        'Sin Dato',
        'Juzgado Mixto de Concepción del Oro',
        'Juzgado Mixto de Miguel Auza',
        'Juzgado Mixto de Teúl de Gonzalez Ortega',
        'Juzgado Mixto de Valparaíso',
        'Juzgado Primero Mixto de Ojocaliente',
        'Juzgado Primero Mixto de Pinos',
        'Juzgado Primero Mixto de Sombrerete',
        'Juzgado Primero Mixto de Calera',
        'Juzgado Primero Mixto de Jalpa',
        'Juzgado Primero Mixto de Pinos',
        'Juzgado Primero Mixto de Rio Grande',
        'Juzgado Primero Mixto de Tlaltenango',
      ];
    }

    this.candidate.subcharge2 = '';
  }

  onSubmit() {
    console.log('Enviando datos del candidato:', this.candidate);
    this.candidateService.submitCandidate(this.candidate).subscribe(
      response => {
        console.log('Candidato enviado exitosamente', response);
        // Redirigir o hacer algo después de la respuesta
        // Guardar en la tabla de registros
        this.registeredCandidates.push({ ...this.candidate });
        // Mostrar mensaje de éxito
        window.alert('✅ Información enviada correctamente.');
        // Limpiar todos los campos del formulario
      this.candidate = {
        name: '',
        email: '',
        electoralKey: '',
        fathersLastName: '',
        mothersLastName: '',
        charge: '',
        subcharge: '',
        subcharge2: ''
      };
      this.specificPositions = [];
      this.subcharge2 = [];
      },
      error => {
        console.error('Error al enviar candidato', error);
      }
    );
  }
}