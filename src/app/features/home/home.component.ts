import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- HERO -->
    <section class="bg-gradient-to-br from-pink-50 via-white to-purple-50
                    min-h-[85vh] flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <!-- Text -->
          <div>
            <span class="inline-block bg-pink-100 text-pink-700 text-sm
                         font-medium px-4 py-1.5 rounded-full mb-6">
              Nouvelle collection 2026
            </span>
            <h1 class="text-5xl lg:text-6xl font-bold text-gray-900
                       leading-tight mb-6">
              Style &amp;
              <span class="text-pink-600"> Élégance</span>
              <br>à votre portée
            </h1>
            <p class="text-lg text-gray-500 mb-8 leading-relaxed">
              Découvrez notre collection exclusive de vêtements tendance.
              Qualité premium, prix accessibles, livraison rapide au Maroc.
            </p>
            <div class="flex flex-wrap gap-4">
              <a routerLink="/catalogue"
                 class="btn-primary text-base px-8 py-3">
                Découvrir la collection
              </a>
              <a routerLink="/catalogue"
                 class="btn-secondary text-base px-8 py-3">
                Voir les offres
              </a>
            </div>

            <!-- Stats -->
            <div class="flex gap-8 mt-12">
              <div>
                <div class="text-2xl font-bold text-gray-900">500+</div>
                <div class="text-sm text-gray-500">Produits</div>
              </div>
              <div class="w-px bg-gray-200"></div>
              <div>
                <div class="text-2xl font-bold text-gray-900">10k+</div>
                <div class="text-sm text-gray-500">Clients</div>
              </div>
              <div class="w-px bg-gray-200"></div>
              <div>
                <div class="text-2xl font-bold text-gray-900">24h</div>
                <div class="text-sm text-gray-500">Livraison</div>
              </div>
            </div>
          </div>

          <!-- Image placeholder -->
          <div class="hidden lg:block">
            <div class="w-full h-96 bg-gradient-to-br from-pink-200
                        to-purple-200 rounded-3xl flex items-center
                        justify-center">
              <div class="text-center">
                <div class="text-8xl mb-4">👗</div>
                <p class="text-gray-600 font-medium">Collection Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-10 text-center">
          Nos catégories
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (cat of categories; track cat.value) {
            <a [routerLink]="['/catalogue']"
               [queryParams]="{category: cat.value}"
               class="group card p-6 text-center hover:shadow-md
                      transition-all duration-200 cursor-pointer">
              <div class="text-4xl mb-3">{{ cat.icon }}</div>
              <div class="font-semibold text-gray-800
                          group-hover:text-pink-600 transition-colors">
                {{ cat.name }}
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900">
            Produits populaires
          </h2>
          <a routerLink="/catalogue"
             class="text-pink-600 hover:text-pink-700 font-medium
                    flex items-center gap-1 transition-colors">
            Voir tout
            <svg class="w-4 h-4" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @for (i of skeletons; track i) {
              <div class="card animate-pulse">
                <div class="h-56 bg-gray-200"></div>
                <div class="p-4 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            @for (product of products(); track product.id) {
              <div class="card group hover:shadow-lg transition-all
                          duration-300">
                <a [routerLink]="['/products', product.id]">
                  <div class="h-56 bg-gradient-to-br from-gray-100
                              to-gray-200 flex items-center justify-center
                              overflow-hidden">
                    @if (product.imageUrl) {
                      <img [src]="product.imageUrl"
                           [alt]="product.name"
                           class="w-full h-full object-cover
                                  group-hover:scale-105 transition-transform
                                  duration-300"/>
                    } @else {
                      <span class="text-5xl">👕</span>
                    }
                  </div>
                </a>
                <div class="p-4">
                  <a [routerLink]="['/products', product.id]">
                    <h3 class="font-semibold text-gray-900 mb-1 truncate
                               hover:text-pink-600 transition-colors">
                      {{ product.name }}
                    </h3>
                  </a>
                  <p class="text-xs text-gray-400 mb-2">
                    {{ product.color }} · {{ product.size }}
                  </p>
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-pink-600">
                      {{ product.price | number:'1.0-0' }} MAD
                    </span>
                    <button (click)="addToCart(product)"
                            [disabled]="product.stock === 0"
                            class="w-8 h-8 bg-pink-600 text-white rounded-full
                                   flex items-center justify-center
                                   hover:bg-pink-700 transition-colors
                                   disabled:opacity-40">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor"
                           viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- BANNER -->
    <section class="py-16 bg-pink-600">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          Livraison gratuite dès 500 MAD
        </h2>
        <p class="text-pink-100 mb-8 text-lg">
          Commandez maintenant et recevez votre colis en 24h
        </p>
        <a routerLink="/catalogue"
           class="bg-white text-pink-600 px-8 py-3 rounded-lg
                  font-semibold hover:bg-pink-50 transition-colors
                  inline-block">
          Commander maintenant
        </a>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {

  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  // ============ STATE ============
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly skeletons = [1, 2, 3, 4];

  readonly categories = [
    { name: 'Homme',       value: 'HOMME',      icon: '👔' },
    { name: 'Femme',       value: 'FEMME',       icon: '👗' },
    { name: 'Enfant',      value: 'ENFANT',      icon: '🧒' },
    { name: 'Accessoires', value: 'ACCESSOIRES', icon: '👜' },
  ];

  // ============ LIFECYCLE ============
  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  // ============ METHODS ============
  private loadFeaturedProducts(): void {
    this.productService.getProducts(0, 8).subscribe({
      next: (page) => {
        this.products.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}