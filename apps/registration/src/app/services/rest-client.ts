import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RestClient {
  private readonly httpClient = inject(HttpClient);

  get(url: string, params?: HttpParams): Observable<unknown> {
    return this.httpClient
      .get(`${environment.apiUrl}${url}`, { params })
      .pipe(catchError(this.handleError));
  }

  post(url: string, postData: unknown): Observable<unknown> {
    return this.httpClient
      .post(`${environment.apiUrl}${url}`, postData)
      .pipe(catchError(this.handleError));
  }

  patch(url: string, patchData: unknown): Observable<unknown> {
    return this.httpClient
      .patch(`${environment.apiUrl}${url}`, patchData)
      .pipe(catchError(this.handleError));
  }

  delete(url: string, id: string): Observable<unknown> {
    return this.httpClient
      .delete(`${environment.apiUrl}${url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent 
      ? error.error.message 
      : error.message || String(error);
      
    return throwError(() => new Error(errorMessage));
  }
}
