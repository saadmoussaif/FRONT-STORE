import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Catalogue</h1>
        <p class="text-gray-500 mt-1">
          {{ totalElements() }} produits disponibles
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">

        <!-- Filters sidebar -->
        <aside class="w-full lg:w-64 shrink-0">
          <div class="card p-6 sticky top-20">
            <h3 class="font-semibold text-gray-900 mb-4">Catégories</h3>
            <div class="space-y-2">
              <button (click)="filterByCategory(null)"
                      [class.text-pink-600]="!selectedCategory()"
                      [class.font-medium]="!selectedCategory()"
                      class="w-full text-left px-3 py-2 rounded-lg
                             hover:bg-pink-50 hover:text-pink-600
                             transition-colors text-gray-600">
                Tous les produits
              </button>
              @for (cat of categories; track cat.value) {
                <button (click)="filterByCategory(cat.value)"
                        [class.bg-pink-50]="selectedCategory() === cat.value"
                        [class.text-pink-600]="selectedCategory() === cat.value"
                        [class.font-medium]="selectedCategory() === cat.value"
                        class="w-full text-left px-3 py-2 rounded-lg
                               hover:bg-pink-50 hover:text-pink-600
                               transition-colors text-gray-600">
                  {{ cat.icon }} {{ cat.name }}
                </button>
              }
            </div>
          </div>
        </aside>

        <!-- Products grid -->
        <div class="flex-1">
          @if (loading()) {
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="card animate-pulse">
                  <div class="h-64 bg-gray-200"></div>
                  <div class="p-4 space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (products().length === 0) {
            <div class="text-center py-20">
              <div class="text-6xl mb-4">🛍️</div>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">
                Aucun produit trouvé
              </h3>
              <p class="text-gray-400">
                Essayez une autre catégorie
              </p>
            </div>
          } @else {
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              @for (product of products(); track product.id) {
                <div class="card group hover:shadow-lg transition-all
                            duration-300">
                  <a [routerLink]="['/products', product.id]">
                    <div class="h-64 bg-gradient-to-br from-gray-100
                                to-gray-200 flex items-center justify-center
                                overflow-hidden relative">
                      @if (product.imageUrl) {
                        <img [src]="product.imageUrl" [alt]="product.name"
                             class="w-full h-full object-cover group-hover:scale-105
                                    transition-transform duration-300"/>
                      } @else {
                        <span class="text-6xl">👕</span>
                      }
                      @if (product.stock <= 5 && product.stock > 0) {
                        <span class="absolute top-2 right-2 badge
                                     bg-orange-100 text-orange-700">
                          Plus que {{ product.stock }}
                        </span>
                      }
                      @if (product.stock === 0) {
                        <div class="absolute inset-0 bg-black/40 flex
                                    items-center justify-center">
                          <span class="bg-white text-gray-800 font-semibold
                                       px-3 py-1 rounded-full text-sm">
                            Rupture de stock
                          </span>
                        </div>
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
                    <p class="text-xs text-gray-400 mb-3">
                      {{ product.color }} · Taille {{ product.size }}
                    </p>
                    <div class="flex items-center justify-between">
                      <span class="text-lg font-bold text-pink-600">
                        {{ product.price | number:'1.0-0' }} MAD
                      </span>
                      <button (click)="addToCart(product)"
                              [disabled]="product.stock === 0"
                              class="w-9 h-9 bg-pink-600 text-white rounded-full
                                     flex items-center justify-center
                                     hover:bg-pink-700 transition-colors
                                     disabled:opacity-40 disabled:cursor-not-allowed">
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

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <div class="flex justify-center gap-2 mt-10">
                <button (click)="changePage(currentPage() - 1)"
                        [disabled]="currentPage() === 0"
                        class="px-4 py-2 border border-gray-300 rounded-lg
                               disabled:opacity-40 hover:bg-gray-50">
                  Précédent
                </button>
                @for (p of getPages(); track p) {
                  <button (click)="changePage(p)"
                          [class.bg-pink-600]="currentPage() === p"
                          [class.text-white]="currentPage() === p"
                          class="w-10 h-10 border border-gray-300 rounded-lg
                                 hover:bg-pink-50">
                    {{ p + 1 }}
                  </button>
                }
                <button (click)="changePage(currentPage() + 1)"
                        [disabled]="currentPage() === totalPages() - 1"
                        class="px-4 py-2 border border-gray-300 rounded-lg
                               disabled:opacity-40 hover:bg-gray-50">
                  Suivant
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class CatalogueComponent implements OnInit {

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  products = signal<Product[]>([]);
  loading = signal(true);
  selectedCategory = signal<string | null>(null);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);

  categories = [
    { name: 'Homme',       value: 'HOMME',      icon: '👔' },
    { name: 'Femme',       value: 'FEMME',       icon: '👗' },
    { name: 'Enfant',      value: 'ENFANT',      icon: '🧒' },
    { name: 'Accessoires', value: 'ACCESSOIRES', icon: '👜' },
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading.set(true);
    this.productService
      .getProducts(this.currentPage(), 12, this.selectedCategory())
      .subscribe({
        next: (page) => {
          this.products.set(page.content);
          this.totalPages.set(page.totalPages);
          this.totalElements.set(page.totalElements);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  filterByCategory(category: string | null) {
    this.selectedCategory.set(category);
    this.currentPage.set(0);
    this.loadProducts();
  }

  changePage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}