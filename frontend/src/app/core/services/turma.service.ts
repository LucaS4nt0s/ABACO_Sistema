import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { Turma, TurmaCreatePayload, TurmaUpdatePayload } from '../models/turma.model';

@Injectable({ providedIn: 'root' })
export class TurmaService {
  private readonly baseUrl = '/api/v1/turmas';

  private _mineCache: Turma[] | null = null;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Turma[]> {
    return this.http.get<Turma[]>(this.baseUrl);
  }

  listMine(): Observable<Turma[]> {
    if (this._mineCache) {
      return of(this._mineCache);
    }
    return this.http.get<Turma[]>(`${this.baseUrl}/me`).pipe(
      tap((data) => this._mineCache = data),
    );
  }

  getById(turmaId: number): Observable<Turma> {
    return this.http.get<Turma>(`${this.baseUrl}/${turmaId}`);
  }

  refreshMine(): Observable<Turma[]> {
    this._mineCache = null;
    return this.listMine();
  }

  create(payload: TurmaCreatePayload): Observable<Turma> {
    return this.http.post<Turma>(this.baseUrl, payload);
  }

  update(turmaId: number, payload: TurmaUpdatePayload): Observable<Turma> {
    return this.http.put<Turma>(`${this.baseUrl}/${turmaId}`, payload);
  }

  delete(turmaId: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/${turmaId}`);
  }
}
