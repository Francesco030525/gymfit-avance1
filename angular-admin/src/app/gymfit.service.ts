import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Clase, Matricula, Usuario } from './modelos';
@Injectable({ providedIn: 'root' })
export class GymfitService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000';
  clases() { return this.http.get<Clase[]>(`${this.base}/clases`); }
  clase(id: string) { return this.http.get<Clase>(`${this.base}/clases/${id}`); }
  crear(clase: Omit<Clase, 'id'>) { return this.http.post<Clase>(`${this.base}/clases`, clase); }
  actualizar(id: string, clase: Omit<Clase, 'id'>) { return this.http.put<Clase>(`${this.base}/clases/${id}`, { ...clase, id }); }
  eliminar(id: string) { return this.http.delete<void>(`${this.base}/clases/${id}`); }
  matriculas() { return this.http.get<Matricula[]>(`${this.base}/matriculas`); }
  cambiarEstadoMatricula(id: string, estado: Matricula['estado']) {
    return this.http.patch<Matricula>(`${this.base}/matriculas/${id}`, { estado });
  }
  usuarios() { return this.http.get<Usuario[]>(`${this.base}/usuarios`); }
}
