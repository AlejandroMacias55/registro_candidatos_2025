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
            <label for="phone">Numero Telefono:</label>
            <input
              type="phone"
              id="phone"
              name="phone"
              [(ngModel)]="candidate.phone"
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
            <label for="charge">Cargo:</label>
            <select
              id="charge"
              name="charge"
              [(ngModel)]="candidate.charge"
              (change)="onPositionTypeChange()"
              required
              class="form-control"
            >
              <option value="">Seleccione un tipo</option>
              <option value="Magistrados">
                Magistraturas Tribunal Superior de Justicia
              </option>
              <option value="Tribunal">
                Magistraturas Tribunal Disciplina Judicial
              </option>
              <option value="Juzgado">Juzgados</option>
            </select>
          </div>
          <div class="form-group" *ngIf="candidate.charge">
            <label for="subcharge">Materia</label>
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
              candidate.charge !== 'Magistrados' &&
              candidate.charge !== 'Tribunal' &&
              candidate.subcharge
            "
          >
            <label for="subcharge2">Distrito</label>
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
              <th>Acciones</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Clave de Elector</th>
              <th>Correo</th>
              <th>Cargo</th>
              <th>Materia</th>
              <th>Distrito</th>
              <th>Creado Por:</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let candidate of registeredCandidates">
              <td>
               <button (click)="openEditModal(candidate)" class="btn btn-warning">
               Editar
               </button>
              </td>
              <td>{{ candidate.name }}</td>
              <td>{{ candidate.fathersLastName }}</td>
              <td>{{ candidate.mothersLastName }}</td>
              <td>{{ candidate.electoralKey }}</td>
              <td>{{ candidate.email }}</td>
              <td>{{ candidate.charge }}</td>
              <td>{{ candidate.subcharge }}</td>
              <td>{{ candidate.subcharge2 }}</td>
              <td>{{ candidate.createdBy ? candidate.createdBy[1] : "" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL DE EDICIÓN -->
    <div class="modal" *ngIf="showEditModal">
        <div class="modal-content">
        <div class="modal-dialog" role="document">
          <h3 class="modal-title"> Editar Candidato</h3>  
          <form (ngSubmit)="updateCandidate()">
            <div class="form-group">
              
              <label for="editName">Nombre:</label>
              <input
                type="text"
                id="editName"
                [(ngModel)]="selectedCandidate.name"
                name="editName"
                class="form-control"
                required
              />
            </div>
            <div class="form-grupo-grid">
              <div >
              <label for="editFathersLastName">Apellido Paterno:</label>
              <input
                type="text"
                id="editFathersLastName"
                [(ngModel)]="selectedCandidate.fathersLastName"
                name="editFathersLastName"
                class="form-control"
                required
              />
              </div>
              <div>
              <label for="editMothersLastName">Apellido Materno:</label>
              <input
                type="text"
                id="editMothersLastName"
                [(ngModel)]="selectedCandidate.mothersLastName"
                name="editMothersLastName"
                class="form-control"
                required
              />
              </div>
            </div>
           
            <div class="form-grupo-grid">
              <div>
              <label for="editelectoralKey">Clave del Elector:</label>
              <input
                type="text"
                id="editelectoralKey"
                [(ngModel)]="selectedCandidate.electoralKey"
                name="editelectoralKey"
                class="form-control"
                required
              />
              </div>
              <div>
              <label for="editphone">Num. Telefono:</label>
              <input
                type="text"
                id="editphone"
                [(ngModel)]="selectedCandidate.phone"
                name="editphone"
                class="form-control"
                required
              />
              </div>
            </div>
           
            <div class="form-group">
              <label for="editemail">Correo Electronico:</label>
              <input
                type="text"
                id="editemail"
                [(ngModel)]="selectedCandidate.email"
                name="editemail"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
            <label for="editcharge">Cargo:</label>
            <select
              id="editcharge"
              name="editcharge"
              [(ngModel)]="selectedCandidate.charge"
              (change)="onPositionTypeChange()"
              required
              class="form-control"
            >
              <option value="">Seleccione un tipo</option>
              <option value="Magistrados">
                Magistraturas Tribunal Superior de Justicia
              </option>
              <option value="Tribunal">
                Magistraturas Tribunal Disciplina Judicial
              </option>
              <option value="Juzgado">Juzgados</option>
            </select>
          </div>
          
          <div class="form-group" *ngIf="selectedCandidate.charge">
            <label for="editsubcharge">Materia</label>
            <select
              id="editsubcharge"
              name="editsubcharge"
              [(ngModel)]="selectedCandidate.subcharge"
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
              selectedCandidate.charge !== 'Magistrados' &&
              selectedCandidate.charge !== 'Tribunal' &&
              selectedCandidate.subcharge
            "
          >
            <label for="editsubcharge2">Distrito</label>
            <select
              id="editsubcharge2"
              name="editsubcharge2"
              [(ngModel)]="selectedCandidate.subcharge2"
              required
              class="form-control"
            >
              <option value="">Seleccione un cargo</option>
              <option *ngFor="let position of subcharge2" [value]="position">
                {{ position }}
              </option>
            </select>
          </div>

            <button type="submit" class="submit-btn">Guardar Cambios</button>
            <div class= "botones-malos">
            <button type="button" class="cancel-btn" (click)="closeEditModal()">
              <-Volver
            </button>
            <button type="button" class="btn-danger" (click)="eliminarCandidato()">Eliminar Registro</button>
            </div>
          </form>
        </div>
      </div>
      </div>
    
  `,
  styles: [
    `
      .form-table-container {
        display: flex;
        flex-direction: column;
        font-size: 0.8rem; /* Reduce el tamaño de la fuente */
        gap: 1rem;
        
        padding: 1rem;
      }
      .modal-dialog {
       position: fixed;
       width: 600px; /* Ancho del modal */
       
       top: 50%;
       left: 50%;
       padding: 2rem;
       
       transform: translate(-50%, -50%);
       background-color: rgb(228, 228, 228);
       box-shadow: 0 10px 30px rgba(7, 109, 192, 0.97);
      }
      .modal-title{
        flex-grow: 1;
        text-align: center; /* Centra el texto del título */
        font-size: 1.5rem; /* Tamaño de fuente */
        color:rgb(0, 0, 0); /* Color del texto */
        margin: 0;
      }
      @media (min-width: 768px) {
        .form-table-container {
          flex-direction: row;
          align-items: flex-start;
        }
      }
      .cancel-btn{
        background-color:rgba(122, 221, 130, 0.87);
        cursor: pointer;
        color: white;
        padding: 0.5rem 1.5rem;
        margin-top: 8px;
        color:rgb(0, 0, 0); /* Color del texto */
      }
      .botones-malos{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .btn-danger{
        background-color:rgb(248, 34, 34);
        cursor: pointer;
        color: white;
        padding: 0.5rem 1.5rem;
        margin-top: 8px;
        
      }

      .form-container {
        flex: .75;
        padding: 1rem;
        background: white;
        border-radius: 4px;
        
        box-shadow: 0 2px 8px rgba(7, 109, 192, 0.97);
      }
      .table-container {
        flex: 2;
        overflow-x: auto;
      }
      .form-group {
        margin-bottom: 1rem;
        
      }
      .form-grupo-grid{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;
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
        text-align: center;
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
    id:0,
    name: "",
    email: "",
    electoralKey: "",
    fathersLastName: "",
    mothersLastName: "",
    charge: "",
    subcharge: "",
    subcharge2: "",
    phone:"",

  };
  
  showEditModal = false;
  selectedCandidate: Candidate = { id:0,
    name: "",
    email: "",
    electoralKey: "",
    fathersLastName: "",
    mothersLastName: "",
    charge: "",
    subcharge: "",
    subcharge2: "",
    phone:"", };
  

  specificPositions: string[] = [];
  subcharge2: string[] = [];
  showModal: boolean = false;
  registeredCandidates: Candidate[] = []; // Lista de candidatos guardados
  constructor(
    private candidateService: CandidateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.candidateService.getCandidates().subscribe(
      (response: Candidate[]) => {
        console.log("Candidatos obtenidos:", response);
        // Ordenar los candidatos por nombre
        this.registeredCandidates = response.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        });
      },
      (error) => {
        console.error("Error al obtener los candidatos", error);
      }
    );
  }

  // Método para eliminar el candidato seleccionado
  eliminarCandidato() {
    if (this.selectedCandidate) {
      if (confirm(`¿Estás seguro de que deseas eliminar a ${this.selectedCandidate.name}?`)) {
        this.candidateService.eliminarCandidato(this.selectedCandidate.id).subscribe(
          () => {
            // Eliminar el candidato del array local
            this.registeredCandidates = this.registeredCandidates.filter(
              (candidato) => candidato.id !== this.selectedCandidate?.id
              
            );
            // Cerrar el modal (si usas Bootstrap)
           // $('#showEditModal').modal('hide');
           Swal.fire("Éxito", "El candidato ha sido actualizado correctamente", "success");
           this.closeEditModal();
          },
          (error) => {
            Swal.fire("Error", "'Error al eliminar el candidato", "error");
            console.error('Error al eliminar el candidato', error);
          }
        );
      }
    }
  }


  

  onPositionTypeChange() {
    //Agregar el selected candidate para cuadno van a modificar
    if (this.candidate.charge === "Magistrados" || this.selectedCandidate.charge === "Magistrados" ) {
      this.specificPositions = [
        "Magistrado de la Primera Sala Penal",
        "Magistrado de la Segunda Sala Penal",
        "Magistrado de la Sala Civil",
        "Magistrado de la Sala Familiar",
      ];
      this.subcharge2 = []; // No hay segunda categoría para magistraturas
      this.candidate.subcharge2 = ""; // Limpia el campo subcharge2
      this.selectedCandidate.subcharge2 = ""; // Limpia el campo subcharge2 de modificacion
    } else if (this.candidate.charge === "Tribunal" || this.selectedCandidate.charge === "Tribunal" ) {
      this.specificPositions = [
        "Magistrado del Tribunal de Disciplina Judicial",
      ];
    } else if (this.candidate.charge === "Juzgado" || this.selectedCandidate.charge === "Juzgado") {
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
    //reinicia seleccion en modificacion
    this.selectedCandidate.subcharge="";
    this.selectedCandidate.subcharge2= "";
  }

  onPositionTypeChange2() {
    //Agregar el selected candidate para cuadno van a modificar
    if (this.candidate.subcharge === "Penal" || this.selectedCandidate.subcharge === "Penal" ) {
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
    } else if (this.candidate.subcharge === "Civil" || this.selectedCandidate.subcharge === "Civil") {
      this.subcharge2 = ["Sin Dato", "Juzgado Primero Civil de Fresnillo"];
    } else if (this.candidate.subcharge === "Familiar" || this.selectedCandidate.subcharge === "Familiar" ) {
      this.subcharge2 = [
        "Sin Dato",
        "Juzgado Primero Familiar de Zacatecas",
        "Juzgado Tercero Familiar de Fresnillo",
      ];
    } else if (this.candidate.subcharge === "Mercantil" || this.selectedCandidate.subcharge === "Mercantil" ) {
      this.subcharge2 = [
        "Sin Dato",
        "Juzgado Primero Mercantil de Fresnillo",
        "Juzgado Segundo Mercantil de Fresnillo",
        "Juzgado Tercero Mercantil de Zacatecas",
      ];
    } else if (this.candidate.subcharge === "Mixto" || this.selectedCandidate.subcharge === "Mixto") {
      this.subcharge2 = [
        "Sin Dato",
        "Juzgado Mixto de Concepción del Oro",
        "Juzgado Mixto de Miguel Auza",
        "Juzgado Mixto de Teúl de Gonzalez Ortega",
        "Juzgado Mixto de Valparaíso",
        "Juzgado Primero Mixto de Ojocaliente",
        "Juzgado Primero Mixto de Pinos",
        "Juzgado Primero Mixto de Sombrerete",
        "Juzgado Segundo Mixto de Calera",
        "Juzgado Segundo Mixto de Jalpa",
        "Juzgado Segundo Mixto de Pinos",
        "Juzgado Segundo Mixto de Rio Grande",
        "Juzgado Segundo Mixto de Tlaltenango",
      ];
    }

    this.candidate.subcharge2 = "";
    //limpiar subcharge2 de midificacion
    this.selectedCandidate.subcharge2 = "";
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
    return !!(this.candidate.name && this.candidate.charge);
  }

  isSubmitting = false;

  onSubmit() {
    
    //console.log("Entra al Onsubmint", this.isSubmitting);
    
    if (this.isSubmitting) return; // Evita que se envíe dos veces seguidas
    this.isSubmitting = true;
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
        this.loadCandidates(); // Cargar los datos actualizados desde el backend
        // Limpiar todos los campos del formulario
        this.candidate = {
          id:0,
          name: "",
          email: "",
          electoralKey: "",
          fathersLastName: "",
          mothersLastName: "",
          charge: "",
          subcharge: "",
          subcharge2: "",
          phone:"",
        };
        this.specificPositions = [];
        this.subcharge2 = [];
        this.isSubmitting=false;
      },
      (error) => {
        console.error("Error al enviar candidato", error);
      }
      
      
    );
    
  }

  openEditModal(candidate: Candidate) {
    console.log("entra al edit modal");
    this.selectedCandidate = { ...candidate };
    this.showEditModal = true;
    console.log(this.showEditModal);
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateCandidate() {
    if (!this.selectedCandidate) return;
  
    this.candidateService.updateCandidate(this.selectedCandidate.id, this.selectedCandidate)
      .subscribe(
        (response) => {
          console.log("Candidato actualizado:", response);
          Swal.fire("Éxito", "El candidato ha sido actualizado correctamente", "success");
          this.loadCandidates(); // Recargar la tabla
          this.showEditModal = false; // Cerrar el modal
        },
        (error) => {
          console.error("Error al actualizar candidato", error);
          Swal.fire("Error", "No se pudo actualizar el candidato", "error");
        }
      );
  }
}
