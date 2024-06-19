import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Client} from "../model/list-clients.model";
import { ApiResponse } from '../../../../shared/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ListClientsService {

  private BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.BASE_URL}clients/findAll`);
  }

  deleteClient(dni: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}clients/delete/${dni}`);
  }

  getClientByDni(dni: string): Observable<ApiResponse<Client>> {
    return this.http.get<ApiResponse<Client>>(`${this.BASE_URL}clients/find/${dni}`);
  }
}
