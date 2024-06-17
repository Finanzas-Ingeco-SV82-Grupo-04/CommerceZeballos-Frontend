import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../shared/api-response.model';
import { Product, ProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  BASE_URL= environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  //Servicio co, el cual se encarga de obtener el producto a editar
  productEdit: Product | null = null;

  sendProductToEdit(productEdit: Product){
    this.productEdit = productEdit;
  }

  getProductToEditService(){
    if(this.productEdit==null){
      return null;
    }
    return this.productEdit;
  }


  // Get all products
  getAllProducts(page: number, size: number): Observable<ApiResponse<any>>{
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}products/findAll`, {params:{page: page.toString(), size: size.toString()}});
  }

  searchProductsByName(query: string, page: number, size: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}products/searchByName`, { params: { name:query, page: page.toString(), size: size.toString() } });
  }

  registerProduct(product: ProductRequest, imageFile: File): Observable<ApiResponse<Product>> {
    console.log("producto registando");
    const formData: FormData = new FormData();
    formData.append('productRequestDto', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    formData.append('file', imageFile);
    return this.http.post<ApiResponse<Product>>(`${this.BASE_URL}products/register`, formData);
  }

  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.BASE_URL}products/delete/${id}`);
  }

  updateProduct(product: ProductRequest, imageFile: File, productId: number): Observable<ApiResponse<any>> {
    const formData: FormData = new FormData();
    formData.append('productRequestDto', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    formData.append('file', imageFile);
    return this.http.put<ApiResponse<any>>(`${this.BASE_URL}products/update/${productId}`, formData);

  }


}
