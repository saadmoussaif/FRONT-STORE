import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private readonly API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createOrder(order: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.API}/orders`, order);
  }

  getMyOrders(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(`${this.API}/orders/my`, { params });
  }

  getAllOrders(status?: string | null, page = 0): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', '20');
    if (status) params = params.set('status', status);
    return this.http.get(`${this.API}/admin/orders`, { params });
  }

  updateOrderStatus(id: string, status: string): Observable<void> {
    const params = new HttpParams().set('status', status);
    return this.http.put<void>(
      `${this.API}/admin/orders/${id}/status`,
      null,
      { params }
    );
  }
  createStripeCheckout(data: any): Observable<any> {
  return this.http.post<any>(
    `${this.API}/payment/checkout`, data
  );
}
}