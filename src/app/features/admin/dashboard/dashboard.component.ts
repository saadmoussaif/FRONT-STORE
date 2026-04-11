import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p class="text-gray-500 mt-1">
          Bienvenue sur votre espace de gestion
        </p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        @for (stat of stats; track stat.label) {
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="text-3xl">{{ stat.icon }}</div>
              <span class="badge" [class]="stat.badgeClass">
                {{ stat.badge }}
              </span>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">
              {{ stat.value }}
            </div>
            <div class="text-sm text-gray-500">{{ stat.label }}</div>
          </div>
        }
      </div>

      <!-- Actions rapides -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h2>
          <div class="space-y-2">
            @for (action of quickActions; track action.label) {
              <a [routerLink]="action.route"
                 class="flex items-center gap-3 p-3 hover:bg-pink-50
                        rounded-xl transition-colors group">
                <div class="w-10 h-10 rounded-xl flex items-center
                            justify-center text-xl transition-colors"
                     [class]="action.bgClass">
                  {{ action.icon }}
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-800 text-sm">
                    {{ action.label }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ action.description }}
                  </div>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            }
          </div>
        </div>

        <!-- Statut système -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Statut du système
          </h2>
          <div class="space-y-4">
            @for (s of systemStatus; track s.name) {
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">{{ s.name }}</span>
                <span class="badge"
                      [class]="s.ok
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'">
                  {{ s.ok ? 'Opérationnel' : 'Hors ligne' }}
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {

  readonly stats = [
    {
      icon: '💰', value: '0 MAD',
      label: 'Chiffre d\'affaires',
      badge: '+0%', badgeClass: 'bg-green-100 text-green-700'
    },
    {
      icon: '🛍️', value: '0',
      label: 'Commandes totales',
      badge: 'Total', badgeClass: 'bg-blue-100 text-blue-700'
    },
    {
      icon: '📦', value: '0',
      label: 'Produits actifs',
      badge: 'Stock', badgeClass: 'bg-purple-100 text-purple-700'
    },
    {
      icon: '⏳', value: '0',
      label: 'En attente',
      badge: 'Urgent', badgeClass: 'bg-orange-100 text-orange-700'
    },
  ];

  readonly quickActions = [
    {
      route: '/admin/products',
      icon: '📦',
      label: 'Gérer les produits',
      description: 'Ajouter, modifier, supprimer',
      bgClass: 'bg-pink-100 group-hover:bg-pink-200'
    },
    {
      route: '/admin/orders',
      icon: '🛍️',
      label: 'Gérer les commandes',
      description: 'Suivre et mettre à jour',
      bgClass: 'bg-blue-100 group-hover:bg-blue-200'
    },
    {
      route: '/',
      icon: '🏪',
      label: 'Voir la boutique',
      description: 'Vue client',
      bgClass: 'bg-green-100 group-hover:bg-green-200'
    },
  ];

  readonly systemStatus = [
    { name: 'API Spring Boot (port 8080)', ok: true },
    { name: 'Base de données PostgreSQL', ok: true },
    { name: 'Stockage images', ok: true },
    { name: 'Service email', ok: false },
  ];
}