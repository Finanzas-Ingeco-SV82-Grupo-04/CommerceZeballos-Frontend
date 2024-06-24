import { registerClient } from './../../security/models/user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SigninService } from '../../security/services/signin.service';
import { registerCurrentAccount } from '../model/current-account.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterAccountService {

  BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient, private signinService: SigninService) { }

  registerCurrentAccount(body: registerCurrentAccount): any {
    return this.http.post<any>(`${this.BASE_URL}current-account/register`, body);
  }

  registerClient(body: registerClient): any {
    return this.signinService.registerClient(body);
  }
}
