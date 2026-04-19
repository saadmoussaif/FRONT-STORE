import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product, ProductPage } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getProducts(
    page = 0,
    size = 12,
    category?: string | null,
    search?: string | null,
    brand?: string | null
  ): Observable<ProductPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  if (search)   params = params.set('search', search);
  if (brand)    params = params.set('brand', brand);
 if (category) params = params.set('category', category);


     return this.http.get<any>(`${this.API}/products`, { params }).pipe(
    map(res => Array.isArray(res) ? {
      content: res,
      totalElements: res.length,
      totalPages: 1,
      pageNumber: 0,
      size: res.length
    } : res)
  );
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