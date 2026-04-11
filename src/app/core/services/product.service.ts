import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductPage } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getProducts(
    page = 0,
    size = 12,
    category?: string | null
  ): Observable<ProductPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (category) params = params.set('category', category);
    return this.http.get<ProductPage>(`${this.API}/products`, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API}/products/${id}`);
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.API}/admin/products`, data);
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API}/admin/products/${id}`, data);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/admin/products/${id}`);
  }
}