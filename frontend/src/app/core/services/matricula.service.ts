import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { Matricula, MatriculaCreatePayload, MatriculaUpdatePayload } from '../models/matricula.model';

@Injectable({ providedIn: 'root' })
export class MatriculaService {
  private readonly baseUrl = '/api/v1/matriculas';

  private _listCache: Matricula[] | null = null;
  private _mineCache: Matricula[] | null = null;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Matricula[]> {
    if (this._listCache) {
      return of(this._listCache);
    }
    return this.http.get<Matricula[]>(this.baseUrl).pipe(
      tap((data) => this._listCache = data),
    );
  }

  listMine(): Observable<Matricula[]> {
    if (this._mineCache) {
      return of(this._mineCache);
    }
    return this.http.get<Matricula[]>(`${this.baseUrl}/me`).pipe(
      tap((data) => this._mineCache = data),
    );
  }

  refreshList(): Observable<Matricula[]> {
    this._listCache = null;
    return this.list();
  }

  refreshMine(): Observable<Matricula[]> {
    this._mineCache = null;
    return this.listMine();
  }

  create(payload: MatriculaCreatePayload): Observable<Matricula> {
    return this.http.post<Matricula>(this.baseUrl, payload);
  }

  update(matriculaId: number, payload: MatriculaUpdatePayload): Observable<Matricula> {
    return this.http.put<Matricula>(`${this.baseUrl}/${matriculaId}`, payload);
  }

  delete(matriculaId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${matriculaId}`);
  }
}
