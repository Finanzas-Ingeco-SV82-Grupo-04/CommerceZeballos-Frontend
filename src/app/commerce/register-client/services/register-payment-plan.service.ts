import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {PaymentPlan} from "../model/current-account.model";
import {ApiResponse} from "../../../../shared/api-response.model";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RegisterPaymentPlanService {

  BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  registerPaymentPlan(paymentPlan: PaymentPlan): Observable<ApiResponse<any>>  {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/payment-plans/register`, paymentPlan);
  }

  findPaymentPlanByDni(dni: string): Observable<ApiResponse<PaymentPlan>> {
    return this.http.get<ApiResponse<PaymentPlan>>(`${this.BASE_URL}/payment-plans/find/${dni}`);
  }

}
