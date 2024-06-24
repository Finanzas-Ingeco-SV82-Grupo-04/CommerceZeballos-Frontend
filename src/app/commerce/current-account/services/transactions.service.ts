import { Injectable } from '@angular/core';
import { Transaction, TransactionRequest } from '../model/transaction.model';
import { ApiResponse } from '../../../../shared/api-response.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private BASE_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getTransactionsByCurrentAccountId(currentAccountId: number): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(`${this.BASE_URL}transactions/current-account/${currentAccountId}`);
  }

  getTransactionById(transactionId: number): Observable<ApiResponse<Transaction>> {
    return this.http.get<ApiResponse<Transaction>>(`${this.BASE_URL}transactions/${transactionId}`);
  }

  registerTransaction(transaction: TransactionRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}transactions/register`, transaction);
  }

  registerPaymentPlan(paymentPlan: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}payment-plan/register`, paymentPlan);
  }
}
