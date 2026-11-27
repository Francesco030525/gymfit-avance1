import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Clase, Matricula, Usuario } from './modelos';
import { GymfitService } from './gymfit.service';
import { EstadoMatriculaPipe } from './estado.pipe';
@Component({
  standalone: true, imports: [NgFor, NgIf, NgClass, EstadoMatriculaPipe],
  template: `<h1>Matrículas</h1><p *ngIf="error" class="alert alert-danger">{{error}}</p>
    <p *ngIf="mensaje" role="status" class="alert alert-success">{{mensaje}}</p>
    <div class="table-responsive"><table class="table table-striped"><thead><tr><th>Código</th><th>Clase</th><th>Estudiante</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody><tr *ngFor="let m of matriculas"><td>{{m.codigo}}</td><td>{{nombreClase(m.claseId)}}</td>
    <td>{{nombreUsuario(m.usuarioId)}}</td><td><span class="badge" [ngClass]="m.estado === 'aprobada' ? 'text-bg-success' : m.estado === 'pendiente' ? 'text-bg-warning' : 'text-bg-danger'">{{m.estado | estadoMatricula}}</span></td>
    <td><div *ngIf="m.estado === 'pendiente'" class="d-flex gap-2">
      <button class="btn btn-sm btn-outline-success" [disabled]="procesando === m.id" (click)="cambiarEstado(m, 'aprobada')">Aprobar</button>
      <button class="btn btn-sm btn-outline-danger" [disabled]="procesando === m.id" (click)="cambiarEstado(m, 'rechazada')">Rechazar</button>
    </div></td></tr></tbody></table></div>`
})
export class ListaMatriculasComponent implements OnInit {
  private api = inject(GymfitService);
  private cdr = inject(ChangeDetectorRef);
  clases: Clase[] = []; matriculas: Matricula[] = []; usuarios: Usuario[] = []; error = ''; mensaje = ''; procesando = '';
  ngOnInit() { forkJoin({ clases: this.api.clases(), matriculas: this.api.matriculas(), usuarios: this.api.usuarios() }).subscribe({
    next: datos => { Object.assign(this, datos); this.cdr.markForCheck(); },
    error: () => { this.error = 'No se pudieron cargar las matrículas.'; this.cdr.markForCheck(); }
  }); }
  nombreClase(id: string) { return this.clases.find(c => String(c.id) === String(id))?.nombre || 'Clase eliminada'; }
  nombreUsuario(id: string) { return this.usuarios.find(u => String(u.id) === String(id))?.nombre || 'Usuario desconocido'; }
  cambiarEstado(matricula: Matricula, estado: Matricula['estado']) {
    this.procesando = matricula.id; this.error = ''; this.mensaje = '';
    this.api.cambiarEstadoMatricula(matricula.id, estado).subscribe({
      next: actualizada => {
        this.matriculas = this.matriculas.map(m => m.id === actualizada.id ? actualizada : m);
        this.mensaje = `La matrícula ${actualizada.codigo} ahora está ${estado}.`;
        this.procesando = ''; this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudo cambiar el estado de la matrícula. Comprueba el API e inténtalo de nuevo.';
        this.procesando = ''; this.cdr.markForCheck();
      }
    });
  }
}
