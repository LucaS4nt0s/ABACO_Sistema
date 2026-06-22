import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { Matricula, MatriculaCreatePayload, MatriculaUpdatePayload } from '../models/matricula.model';

@Injectable({ providedIn: 'root' })
export class MatriculaService {
  private readonly baseUrl = '/api/v1/matriculas';

  private _list$: Observable<Matricula[]> | null = null;
  private _mine$: Observable<Matricula[]> | null = null;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Matricula[]> {
    if (!this._list$) {
      this._list$ = this.http.get<Matricula[]>(this.baseUrl).pipe(shareReplay(1));
    }
    return this._list$;
  }

  listMine(): Observable<Matricula[]> {
    if (!this._mine$) {
      this._mine$ = this.http.get<Matricula[]>(`${this.baseUrl}/me`).pipe(shareReplay(1));
    }
    return this._mine$;
  }

  refreshList(): Observable<Matricula[]> {
    this._list$ = null;
    return this.list();
  }

  refreshMine(): Observable<Matricula[]> {
    this._mine$ = null;
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
