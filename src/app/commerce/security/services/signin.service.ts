import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { signInRequest, userSignInResponse } from '../models/user.model';
import { ApiResponse } from '../../../../shared/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  BASE_URL = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }





  // Sign In
  signIn(body:signInRequest): Observable<userSignInResponse>{

    return this.http.post<userSignInResponse>(`${this.BASE_URL}auth/user/sign-in`, body);
  }













}


