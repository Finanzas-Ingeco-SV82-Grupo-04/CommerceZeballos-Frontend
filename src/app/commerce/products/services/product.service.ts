import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../shared/api-response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  BASE_URL= environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }


  // Get all products
  getAllProducts(page: number, size: number): Observable<ApiResponse<any>>{
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}products/findAll`, {params:{page: page.toString(), size: size.toString()}});
  }

  searchProducts(query: string, page: number, size: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}products/searchByName`, { params: { name:query, page: page.toString(), size: size.toString() } });
  }
}
