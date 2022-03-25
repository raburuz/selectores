import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PaisAPIResponse } from '../interfaces/pais';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private apiUrl = 'https://restcountries.com/v3.1';
  private _continentes: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  constructor(private http: HttpClient) {}

  get continentes(): string[] {
    return [...this._continentes];
  }

  paises(continente: string): Observable<PaisAPIResponse[]> | Observable<null> {
    if (!continente) {
      return of(null);
    }
    return this.http.get<PaisAPIResponse[]>(
      `${this.apiUrl}/region/${continente}?fields=name,cca2,borders`
    );
  }

  fronteras(alphaCode: string): Observable<PaisAPIResponse> | Observable<null> {
    if (!alphaCode) {
      return of(null);
    }
    return this.http.get<PaisAPIResponse>(
      `${this.apiUrl}/alpha/${alphaCode}?fields=name,borders`
    );
  }
}
