import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { retry, retryWhen, catchError, delay, take, map } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { getAccessToken } from './jwt';

// import { getAccessToken } from './jwt';

let router: Router;
const STATUS_SUCCESS = 'success';

@Injectable({
  providedIn: 'root'
})

export default class httpService {

  // Base url
  baseurl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${getAccessToken()}`,
      // 'Authorization': 'Bearer',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cache: 'no-cache'
    })
  }

  querySearch(params: { [x: string]: string | number | boolean; }) {
    return (
        Object
        .keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
    )
  }

  mapFilePayload(data: { [x: string]: string | Blob; }) {
    let formData = new FormData();
    Object.keys(data).map(function(key, index) {
        formData.append(key, data[key])
    });
    return formData;
  }

  // POST
  post(endpoint: string, data: { [x: string]: string | number | boolean; }): Observable<any> {
    return this.http.post<any>(this.baseurl + endpoint, JSON.stringify(data), this.httpOptions)
    .pipe(
      catchError(this.errorHandle)
    )
  }  

  // GET
  get(endpoint: string, params: { [x: string]: string | number | boolean; } = {}): Observable<any> {
    if (Object.keys(params).length > 0) {
      endpoint = `${endpoint}?${this.querySearch(params)}`
    }
    return this.http.get<any>(this.baseurl + endpoint, this.httpOptions)
    .pipe(
      map(res => {
        if (res.errors && res.status !== STATUS_SUCCESS) {
          this.errorHandle(res.errors)
        }
        return res;
      }),
      catchError(this.errorHandle)
    )
  }

  // PUT
  put(endpoint: string, data: { [x: string]: string | number | boolean; }): Observable<any> {
    return this.http.put<any>(this.baseurl + endpoint, JSON.stringify(data), this.httpOptions)
    .pipe(
       map(res => {
        if (res.errors && res.status !== STATUS_SUCCESS) {
          this.errorHandle(res.errors)
        }
        return res;
      }),
      catchError(this.errorHandle)
    )
  }

  // del method
  delete(endpoint: string){
    return this.http.delete<any>(this.baseurl + endpoint, this.httpOptions)
    .pipe(
       map(res => {
        if (res.errors && res.status !== STATUS_SUCCESS) {
          this.errorHandle(res.errors)
        }
        return res;
      }),
      catchError(this.errorHandle)
    )
  }

  upload(endpoint: string, fileData: { [x: string]: string | Blob; }) {
    if (!endpoint || !fileData) return false;
    let formData = this.mapFilePayload(fileData);
    return this.http.post<any>(
      this.baseurl + endpoint,
      formData,
      {
        reportProgress: true,
        observe: 'events',
        headers: new HttpHeaders({
          // 'Authorization': `Bearer ${getAccessToken()}`,
          'Authorization': 'Bearer',
          Accept: 'application/json',
          Cache: 'no-cache'
        })
      }
    )
    .pipe(
      catchError(this.errorHandle)
    )
  }

  // Error handling
  errorHandle(error: { error: { message: string; }; status: any; message: any; }) {
    console.log('Err: ', error);
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     console.log(errorMessage);
     return throwError(errorMessage);
  }
}
