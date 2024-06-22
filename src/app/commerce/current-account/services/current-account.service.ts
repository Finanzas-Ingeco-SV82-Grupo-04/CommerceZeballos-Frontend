import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../../shared/api-response.model';
import { CurrentAccount } from '../model/current-account.model';
import { Transaction } from '../model/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentAccountService {

  private BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getCurrentAccountByDni(dni: string): Observable<ApiResponse<CurrentAccount>> {
    return this.http.get<ApiResponse<CurrentAccount>>(`${this.BASE_URL}current-account/find/${dni}`)
    
  }



  //RECEURDA, FALTA LA LOGICA PARA ELIMINAR UNA CUENTA SI SE ELIMINA SU CLIENTE, LO MEJOR SERIA AGREGAR UN PARAMETRO DE BOLEAN PARA DESACTIVAR LA CUENTA
}
