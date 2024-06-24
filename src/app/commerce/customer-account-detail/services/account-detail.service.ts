import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Client} from "../../list-clients/model/list-clients.model";
import {ApiResponse} from "../../../../shared/api-response.model";
import {environment} from "../../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountDetailService {

  private BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.BASE_URL}clients/findAll`);
  }

  getClientByDni(dni: string): Observable<ApiResponse<Client>> {
    return this.http.get<ApiResponse<Client>>(`${this.BASE_URL}clients/find/${dni}`);
  }

}
