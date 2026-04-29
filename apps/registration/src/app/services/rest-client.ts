import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RestClient {
  private readonly _httpClient = inject(HttpClient);

  get(url: string, params?: HttpParams): Observable<any> {
    return this._httpClient
      .get<any>(environment.apiUrl + url, { params })
      .pipe(catchError(this.handleError));
  }

  post(url: string, postData: any): Observable<any> {
    return this._httpClient
      .post<any>(environment.apiUrl + url, postData)
      .pipe(catchError(this.handleError));
  }

  patch(url: string, patchData: any): Observable<any> {
    return this._httpClient
      .patch<any>(environment.apiUrl + url, patchData)
      .pipe(catchError(this.handleError));
  }

  delete(url: string, id: string): Observable<any> {
    return this._httpClient
      .delete<any>(environment.apiUrl + url + '/' + id)
      .pipe(catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}
