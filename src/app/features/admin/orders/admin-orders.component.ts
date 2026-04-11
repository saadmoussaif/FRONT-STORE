import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Commandes</h1>
        <p class="text-gray-500 mt-1">Gérer et suivre toutes les commandes</p>
      </div>

      <!-- Filtres statut -->
      <div class="flex flex-wrap gap-2 mb-6">
        @for (s of statusFilters; track s.value) {
          <button (click)="filterByStatus(s.value)"
                  [class.bg-pink-600]="selectedStatus() === s.value"
                  [class.text-white]="selectedStatus() === s.value"
                  [class.border-pink-600]="selectedStatus() === s.value"
                  class="px-4 py-2 border border-gray-300 rounded-full
                         text-sm hover:border-pink-400 transition-all
                         duration-200">
            {{ s.label }}
          </button>
        }
      </div>

      <!-- Table commandes -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500
                           uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @if (loading()) {
                @for (i of skeletons; track i) {
                  <tr class="animate-pulse">
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-28"></div>
                    </td>
                  </tr>
                }
              } @else {
                @for (order of orders(); track order.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <span class="font-mono text-sm text-gray-600
                                   bg-gray-100 px-2 py-1 rounded">
                        #{{ order.id.slice(0, 8).toUpperCase() }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="font-medium text-sm text-gray-900">
                        {{ order.customerName }}
                      </div>
                      <div class="text-xs text-gray-400">
                        {{ order.customerEmail }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="font-semibold text-pink-600 text-sm">
                        {{ order.totalAmount | number:'1.0-0' }} MAD
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="badge"
                            [class]="getStatusClass(order.status)">
                        {{ getStatusLabel(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}
                    </td>
                    <td class="px-6 py-4">
                      <select
                        (change)="updateStatus(order.id,
                                  $any($event.target).value)"
                        class="text-xs border border-gray-200 rounded-lg
                               px-2 py-1.5 text-gray-600 focus:outline-none
                               focus:ring-1 focus:ring-pink-500
                               bg-white cursor-pointer">
                        @for (s of orderStatuses; track s.value) {
                          <option [value]="s.value"
                                  [selected]="order.status === s.value">
                            {{ s.label }}
                          </option>
                        }
                      </select>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
        @if (!loading() && orders().length === 0) {
          <div class="text-center py-12 text-gray-400">
            <div class="text-4xl mb-3">🛍️</div>
            <p>Aucune commande trouvée.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {

  private readonly orderService = inject(OrderService);

  // ============ STATE ============
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly selectedStatus = signal<string | null>(null);
  readonly skeletons = [1, 2, 3, 4];

  readonly statusFilters = [
    { value: null,         label: 'Toutes' },
    { value: 'PENDING',    label: 'En attente' },
    { value: 'PAID',       label: 'Payées' },
    { value: 'PROCESSING', label: 'En cours' },
    { value: 'SHIPPED',    label: 'Expédiées' },
    { value: 'DELIVERED',  label: 'Livrées' },
    { value: 'CANCELLED',  label: 'Annulées' },
  ];

  readonly orderStatuses = [
    { value: 'PENDING',    label: 'En attente' },
    { value: 'PAID',       label: 'Payée' },
    { value: 'PROCESSING', label: 'En cours' },
    { value: 'SHIPPED',    label: 'Expédiée' },
    { value: 'DELIVERED',  label: 'Livrée' },
    { value: 'CANCELLED',  label: 'Annulée' },
  ];

  // ============ LIFECYCLE ============
  ngOnInit(): void {
    this.loadOrders();
  }

  // ============ METHODS ============
  private loadOrders(): void {
    this.loading.set(true);
    this.orderService.getAllOrders(this.selectedStatus()).subscribe({
      next: (res: any) => {
        this.orders.set(res.content ?? res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filterByStatus(status: string | null): void {
    this.selectedStatus.set(status);
    this.loadOrders();
  }

  updateStatus(orderId: string, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => this.loadOrders()
    });
  }

  getStatusClass(status: OrderStatus): string {
    const map: Record<string, string> = {
      PENDING:    'bg-yellow-100 text-yellow-700',
      PAID:       'bg-green-100 text-green-700',
      PROCESSING: 'bg-blue-100 text-blue-700',
      SHIPPED:    'bg-purple-100 text-purple-700',
      DELIVERED:  'bg-teal-100 text-teal-700',
      CANCELLED:  'bg-red-100 text-red-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700';
  }

  getStatusLabel(status: OrderStatus): string {
    const map: Record<string, string> = {
      PENDING:    'En attente',
      PAID:       'Payée',
      PROCESSING: 'En cours',
      SHIPPED:    'Expédiée',
      DELIVERED:  'Livrée',
      CANCELLED:  'Annulée',
    };
    return map[status] ?? status;
  }
}