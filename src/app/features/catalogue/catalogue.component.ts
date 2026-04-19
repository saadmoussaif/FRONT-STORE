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
        <h1 class="text-4xl font-black text-[#0a1628] uppercase
                   tracking-tight">
          Catalogue
        </h1>
        <p class="text-gray-400 mt-1 font-medium">
          {{ totalElements() }} produits disponibles
        </p>
      </div>

      <!-- Recherche -->
      <div class="mb-8">
        <div class="relative max-w-lg">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5
                      text-gray-400" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input [(ngModel)]="searchQuery"
                 (input)="onSearch()"
                 type="text"
                 placeholder="Rechercher Nike, Adidas, T-shirt..."
                 class="input-field pl-12 w-full"/>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">

        <!-- ===== SIDEBAR FILTRES ===== -->
        <aside class="w-full lg:w-64 shrink-0">
          <div class="bg-white rounded-xl border border-gray-100
                      p-6 sticky top-20">

            <!-- Header filtres -->
            <div class="flex justify-between items-center mb-6">
              <h3 class="font-black text-[#0a1628] uppercase
                         tracking-widest text-sm">
                Filtres
              </h3>
              <button (click)="resetFilters()"
                      class="text-xs text-orange-500 font-black
                             uppercase hover:text-orange-600
                             transition-colors">
                Reset
              </button>
            </div>

            <!-- Catégories -->
            <div class="mb-6">
              <h4 class="text-xs font-black text-gray-400 uppercase
                         tracking-widest mb-3">
                Catégorie
              </h4>
              <div class="space-y-1">
                <button (click)="filterByCategory(null)"
                        [class.bg-[#0a1628]]="!selectedCategory()"
                        [class.text-white]="!selectedCategory()"
                        [class.text-gray-600]="selectedCategory()"
                        class="w-full text-left px-3 py-2.5 rounded-lg
                               font-bold uppercase text-xs tracking-wide
                               transition-all hover:bg-gray-50">
                  🏆 Tous les produits
                </button>
                @for (cat of categories; track cat.value) {
                  <button (click)="filterByCategory(cat.value)"
                          [class.bg-[#0a1628]]="
                            selectedCategory() === cat.value"
                          [class.text-white]="
                            selectedCategory() === cat.value"
                          [class.text-gray-600]="
                            selectedCategory() !== cat.value"
                          class="w-full text-left px-3 py-2.5 rounded-lg
                                 font-bold uppercase text-xs tracking-wide
                                 transition-all hover:bg-gray-50">
                    {{ cat.icon }} {{ cat.name }}
                  </button>
                }
              </div>
            </div>

            <!-- Brands -->
            <div class="mb-6 border-t border-gray-100 pt-5">
              <h4 class="text-xs font-black text-gray-400 uppercase
                         tracking-widest mb-3">
                Brand
              </h4>
              <div class="space-y-2.5">
                @for (brand of brands; track brand) {
                  <label class="flex items-center gap-3
                                cursor-pointer group">
                    <div (click)="toggleBrand(brand)"
                         [class.bg-orange-500]="
                           selectedBrands().includes(brand)"
                         [class.border-orange-500]="
                           selectedBrands().includes(brand)"
                         [class.border-gray-300]="
                           !selectedBrands().includes(brand)"
                         class="w-5 h-5 rounded border-2 flex items-center
                                justify-center cursor-pointer
                                transition-all shrink-0">
                      @if (selectedBrands().includes(brand)) {
                        <svg class="w-3 h-3 text-white" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      }
                    </div>
                    <span (click)="toggleBrand(brand)"
                          [class.text-orange-500]="
                            selectedBrands().includes(brand)"
                          [class.font-black]="
                            selectedBrands().includes(brand)"
                          class="text-sm font-bold text-gray-700
                                 group-hover:text-orange-500
                                 transition-colors uppercase cursor-pointer">
                      {{ brand }}
                    </span>
                  </label>
                }
              </div>
            </div>

            <!-- Tailles -->
            <div class="border-t border-gray-100 pt-5">
              <h4 class="text-xs font-black text-gray-400 uppercase
                         tracking-widest mb-3">
                Taille
              </h4>
              <div class="grid grid-cols-3 gap-2">
                @for (size of sizes; track size) {
                  <button (click)="toggleSize(size)"
                          [class.bg-[#0a1628]]="
                            selectedSizes().includes(size)"
                          [class.text-white]="
                            selectedSizes().includes(size)"
                          [class.border-[#0a1628]]="
                            selectedSizes().includes(size)"
                          [class.border-gray-200]="
                            !selectedSizes().includes(size)"
                          [class.text-gray-600]="
                            !selectedSizes().includes(size)"
                          class="border-2 rounded-lg py-2 text-xs
                                 font-black uppercase hover:border-orange-500
                                 hover:text-orange-500 transition-all">
                    {{ size }}
                  </button>
                }
              </div>
            </div>

            <!-- Filtres actifs -->
            @if (hasActiveFilters()) {
              <div class="border-t border-gray-100 pt-5 mt-5">
                <h4 class="text-xs font-black text-gray-400 uppercase
                           tracking-widest mb-3">
                  Actifs
                </h4>
                <div class="flex flex-wrap gap-2">
                  @if (selectedCategory()) {
                    <span class="badge bg-[#0a1628] text-white
                                 text-xs">
                      {{ selectedCategory() }}
                      <button (click)="filterByCategory(null)"
                              class="ml-1 hover:text-orange-300">
                        ×
                      </button>
                    </span>
                  }
                  @for (brand of selectedBrands(); track brand) {
                    <span class="badge bg-orange-500 text-white
                                 text-xs">
                      {{ brand }}
                      <button (click)="toggleBrand(brand)"
                              class="ml-1 hover:text-orange-200">
                        ×
                      </button>
                    </span>
                  }
                  @for (size of selectedSizes(); track size) {
                    <span class="badge bg-gray-800 text-white
                                 text-xs">
                      {{ size }}
                      <button (click)="toggleSize(size)"
                              class="ml-1">×</button>
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </aside>

        <!-- ===== GRILLE PRODUITS ===== -->
        <div class="flex-1">

          @if (loading()) {
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              @for (i of skeletons; track i) {
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
              <div class="text-6xl mb-4">🔍</div>
              <h3 class="text-xl font-black text-gray-700 uppercase
                         mb-2">
                Aucun produit
              </h3>
              <p class="text-gray-400 mb-6">
                Essayez d'autres filtres
              </p>
              <button (click)="resetFilters()"
                      class="btn-primary">
                Voir tout
              </button>
            </div>

          } @else {
            <!-- Sort bar -->
            <div class="flex justify-between items-center mb-6">
              <span class="text-sm font-bold text-gray-400 uppercase
                           tracking-wide">
                {{ products().length }} résultats
              </span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
              @for (product of products(); track product.id) {
                <div class="card group hover:shadow-lg
                            transition-all duration-300">
                  <a [routerLink]="['/products', product.id]">
                    <div class="h-64 bg-gray-50 flex items-center
                                justify-center overflow-hidden
                                relative">
                      @if (product.imageUrl) {
                        <img [src]="product.imageUrl"
                             [alt]="product.name"
                             class="w-full h-full object-cover
                                    group-hover:scale-105
                                    transition-transform duration-300"/>
                      } @else {
                        <span class="text-6xl">👟</span>
                      }

                      <!-- Stock badge -->
                      @if (product.stock > 0 && product.stock <= 5) {
                        <span class="absolute top-2 right-2 badge
                                     bg-orange-500 text-white text-xs">
                          {{ product.stock }} restants
                        </span>
                      }
                      @if (product.stock === 0) {
                        <div class="absolute inset-0 bg-black/50
                                    flex items-center justify-center">
                          <span class="bg-white text-gray-900
                                       font-black px-3 py-1 rounded
                                       text-xs uppercase">
                            Épuisé
                          </span>
                        </div>
                      }

                      <!-- Brand badge -->
                      @if (product.brand) {
                        <span class="absolute top-2 left-2 badge
                                     bg-[#0a1628] text-white text-xs">
                          {{ product.brand }}
                        </span>
                      }
                    </div>
                  </a>

                  <div class="p-4">
                    <a [routerLink]="['/products', product.id]">
                      <h3 class="font-black text-gray-900 mb-1
                                 truncate hover:text-orange-500
                                 transition-colors uppercase text-sm">
                        {{ product.name }}
                      </h3>
                    </a>
                    <p class="text-xs text-gray-400 font-medium mb-3
                               uppercase">
                      {{ product.color }}
                      @if (product.size) { · {{ product.size }} }
                    </p>
                    <div class="flex items-center justify-between">
                      <span class="text-lg font-black text-[#0a1628]">
                        {{ product.price | number:'1.0-0' }}
                        <span class="text-orange-500 text-sm">MAD</span>
                      </span>
                      <button (click)="addToCart(product)"
                              [disabled]="product.stock === 0"
                              class="w-9 h-9 bg-[#0a1628] text-white
                                     rounded-lg flex items-center
                                     justify-center hover:bg-orange-500
                                     transition-colors disabled:opacity-40
                                     disabled:cursor-not-allowed">
                        <svg class="w-4 h-4" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round"
                                stroke-linejoin="round"
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
                        class="px-4 py-2 border-2 border-gray-200
                               rounded-lg font-bold text-sm uppercase
                               disabled:opacity-40 hover:border-orange-500
                               hover:text-orange-500 transition-all">
                  ← Prev
                </button>
                @for (p of getPages(); track p) {
                  <button (click)="changePage(p)"
                          [class.bg-[#0a1628]]="currentPage() === p"
                          [class.text-white]="currentPage() === p"
                          class="w-10 h-10 border-2 border-gray-200
                                 rounded-lg font-black text-sm
                                 hover:border-orange-500
                                 hover:text-orange-500 transition-all">
                    {{ p + 1 }}
                  </button>
                }
                <button (click)="changePage(currentPage() + 1)"
                        [disabled]="currentPage() >= totalPages() - 1"
                        class="px-4 py-2 border-2 border-gray-200
                               rounded-lg font-bold text-sm uppercase
                               disabled:opacity-40 hover:border-orange-500
                               hover:text-orange-500 transition-all">
                  Next →
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

  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);

  // ============ STATE ============
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly selectedCategory = signal<string | null>(null);
  readonly selectedBrands = signal<string[]>([]);
  readonly selectedSizes = signal<string[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly skeletons = [1, 2, 3, 4, 5, 6];

  searchQuery = '';
  private searchTimeout: any;

  readonly categories = [
    { name: 'Homme',       value: 'HOMME',      icon: '👔' },
    { name: 'Femme',       value: 'FEMME',       icon: '👗' },
    { name: 'Enfant',      value: 'ENFANT',      icon: '🧒' },
    { name: 'Accessoires', value: 'ACCESSOIRES', icon: '🎒' },
  ];

  readonly brands = ['Nike', 'Adidas', 'Puma', 'New Balance'];
  readonly sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // ============ LIFECYCLE ============
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      this.loadProducts();
    });
  }

  // ============ METHODS ============
  private loadProducts(): void {
    this.loading.set(true);
    this.productService
      .getProducts(
        this.currentPage(),
        12,
        this.selectedCategory(),
        this.searchQuery || undefined
      )
      .subscribe({
        next: (page) => {
          let results = page.content;

          // Filtre brand côté client
          if (this.selectedBrands().length > 0) {
            results = results.filter(p =>
              p.brand && this.selectedBrands().includes(p.brand)
            );
          }

          // Filtre taille côté client
          if (this.selectedSizes().length > 0) {
            results = results.filter(p =>
              p.size && this.selectedSizes().includes(p.size)
            );
          }

          this.products.set(results);
          this.totalPages.set(page.totalPages);
          this.totalElements.set(page.totalElements);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(0);
      this.loadProducts();
    }, 400);
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory.set(category);
    this.currentPage.set(0);
    this.loadProducts();
  }

  toggleBrand(brand: string): void {
    const current = this.selectedBrands();
    this.selectedBrands.set(
      current.includes(brand)
        ? current.filter(b => b !== brand)
        : [...current, brand]
    );
    this.currentPage.set(0);
    this.loadProducts();
  }

  toggleSize(size: string): void {
    const current = this.selectedSizes();
    this.selectedSizes.set(
      current.includes(size)
        ? current.filter(s => s !== size)
        : [...current, size]
    );
    this.currentPage.set(0);
    this.loadProducts();
  }

  resetFilters(): void {
    this.selectedCategory.set(null);
    this.selectedBrands.set([]);
    this.selectedSizes.set([]);
    this.searchQuery = '';
    this.currentPage.set(0);
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.selectedCategory() ||
      this.selectedBrands().length > 0 ||
      this.selectedSizes().length > 0 ||
      this.searchQuery
    );
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}