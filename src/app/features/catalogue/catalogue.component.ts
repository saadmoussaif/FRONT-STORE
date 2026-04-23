import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
  <div class="mb-6">
    <h1 class="text-4xl font-black text-[#0a1628] uppercase tracking-tight">
      Catalogue
    </h1>
    <p class="text-gray-400 mt-1 font-medium">
      {{ totalElements() }} produits disponibles
    </p>
  </div>

  <!-- Recherche -->
  <div class="mb-6">
    <div class="relative max-w-lg">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input [(ngModel)]="searchQuery" (input)="onSearch()" type="text"
             placeholder="Rechercher Nike, Adidas, T-shirt..."
             class="input-field pl-12 w-full"/>
    </div>
  </div>

  <!-- Chips filtres actifs -->
  @if (hasActiveFilters()) {
    <div class="flex flex-wrap gap-2 mb-6 items-center">
      <span class="text-xs font-bold text-gray-400 uppercase tracking-wide mr-1">
        Filtres actifs :
      </span>
      @if (selectedCategory()) {
        <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                     bg-[#0a1628] text-white text-xs font-bold uppercase">
          {{ selectedCategory() }}
          <button (click)="filterByCategory(null)" class="ml-1 hover:text-orange-300 text-base leading-none">×</button>
        </span>
      }
      @for (brand of selectedBrands(); track brand) {
        <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                     bg-orange-500 text-white text-xs font-bold uppercase">
          {{ brand }}
          <button (click)="toggleBrand(brand)" class="ml-1 hover:text-orange-200 text-base leading-none">×</button>
        </span>
      }
      @for (size of selectedSizes(); track size) {
        <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                     bg-gray-700 text-white text-xs font-bold">
          {{ size }}
          <button (click)="toggleSize(size)" class="ml-1 text-base leading-none">×</button>
        </span>
      }
      @if (onlyInStock()) {
        <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                     bg-green-600 text-white text-xs font-bold">
          En stock
          <button (click)="onlyInStock.set(false); loadProducts()" class="ml-1 text-base leading-none">×</button>
        </span>
      }
      @if (onlyDiscount()) {
        <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                     bg-red-500 text-white text-xs font-bold">
          Avec réduction
          <button (click)="onlyDiscount.set(false); loadProducts()" class="ml-1 text-base leading-none">×</button>
        </span>
      }
      @if (priceMin() > 0 || priceMax() < 3000) {
        <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                     bg-blue-600 text-white text-xs font-bold">
          {{ priceMin() }}–{{ priceMax() }} dh
          <button (click)="resetPrice()" class="ml-1 text-base leading-none">×</button>
        </span>
      }
      <button (click)="resetFilters()"
              class="text-xs text-orange-500 font-black uppercase hover:text-orange-600 ml-2">
        Tout effacer
      </button>
    </div>
  }

  <div class="flex flex-col lg:flex-row gap-8">

    <!-- ===== SIDEBAR ===== -->
    <aside class="w-full lg:w-64 shrink-0">
      <div class="bg-white rounded-xl border border-gray-100 p-5 sticky top-20 space-y-5">

        <!-- Prix -->
        <div>
          <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Prix (dh)
          </h4>
          <div class="flex gap-2 mb-3">
            <input type="number" [(ngModel)]="priceMinValue"
                   (change)="onPriceChange()"
                   placeholder="Min"
                   class="w-full border border-gray-200 rounded-lg px-3 py-2
                          text-sm focus:outline-none focus:border-orange-400"/>
            <input type="number" [(ngModel)]="priceMaxValue"
                   (change)="onPriceChange()"
                   placeholder="Max"
                   class="w-full border border-gray-200 rounded-lg px-3 py-2
                          text-sm focus:outline-none focus:border-orange-400"/>
          </div>
          <input type="range" min="50" max="3000" step="50"
                 [value]="priceMaxValue"
                 (input)="onSliderChange($event)"
                 class="w-full accent-orange-500"/>
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>50 dh</span><span>3 000 dh</span>
          </div>
        </div>

        <!-- Disponibilité -->
        <div class="border-t border-gray-100 pt-5">
          <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Disponibilité
          </h4>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm font-bold text-gray-700">En stock uniquement</span>
            <div (click)="toggleInStock()"
                 [class.bg-orange-500]="onlyInStock()"
                 [class.bg-gray-200]="!onlyInStock()"
                 class="relative w-10 h-5 rounded-full transition-colors cursor-pointer">
              <div [class.translate-x-5]="onlyInStock()"
                   [class.translate-x-1]="!onlyInStock()"
                   class="absolute top-0.5 w-4 h-4 bg-white rounded-full
                          shadow transition-transform"></div>
            </div>
          </label>
        </div>

        <!-- Catégories -->
        <div class="border-t border-gray-100 pt-5">
          <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Catégorie
          </h4>
          <div class="space-y-1">
            <button (click)="filterByCategory(null)"
                    [class.bg-[#0a1628]]="!selectedCategory()"
                    [class.text-white]="!selectedCategory()"
                    [class.text-gray-600]="selectedCategory()"
                    class="w-full text-left px-3 py-2 rounded-lg font-bold
                           uppercase text-xs tracking-wide transition-all hover:bg-gray-50">
              🏆 Tous les produits
            </button>
            @for (cat of categories; track cat.value) {
              <button (click)="filterByCategory(cat.value)"
                      [class.bg-[#0a1628]]="selectedCategory() === cat.value"
                      [class.text-white]="selectedCategory() === cat.value"
                      [class.text-gray-600]="selectedCategory() !== cat.value"
                      class="w-full text-left px-3 py-2 rounded-lg font-bold
                             uppercase text-xs tracking-wide transition-all hover:bg-gray-50">
                {{ cat.icon }} {{ cat.name }}
              </button>
            }
          </div>
        </div>

        <!-- Marques -->
        <div class="border-t border-gray-100 pt-5">
          <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Marque
          </h4>
          <div class="space-y-2">
            @for (brand of availableBrands(); track brand.name) {
              <label class="flex items-center gap-3 cursor-pointer group">
                <div (click)="toggleBrand(brand.name)"
                     [class.bg-orange-500]="selectedBrands().includes(brand.name)"
                     [class.border-orange-500]="selectedBrands().includes(brand.name)"
                     [class.border-gray-300]="!selectedBrands().includes(brand.name)"
                     class="w-4 h-4 rounded border-2 flex items-center justify-center
                            cursor-pointer transition-all shrink-0">
                  @if (selectedBrands().includes(brand.name)) {
                    <svg class="w-2.5 h-2.5 text-white" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  }
                </div>
                <span (click)="toggleBrand(brand.name)"
                      [class.text-orange-500]="selectedBrands().includes(brand.name)"
                      [class.font-black]="selectedBrands().includes(brand.name)"
                      class="text-sm font-bold text-gray-700 group-hover:text-orange-500
                             transition-colors uppercase cursor-pointer flex-1">
                  {{ brand.name }}
                </span>
                <span class="text-xs text-gray-400">{{ brand.count }}</span>
              </label>
            }
          </div>
        </div>

        <!-- Tailles -->
        <div class="border-t border-gray-100 pt-5">
          <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Taille
          </h4>
          <div class="grid grid-cols-3 gap-2">
            @for (size of sizes; track size) {
              <button (click)="toggleSize(size)"
                      [class.bg-[#0a1628]]="selectedSizes().includes(size)"
                      [class.text-white]="selectedSizes().includes(size)"
                      [class.border-[#0a1628]]="selectedSizes().includes(size)"
                      [class.border-gray-200]="!selectedSizes().includes(size)"
                      [class.text-gray-600]="!selectedSizes().includes(size)"
                      class="border-2 rounded-lg py-1.5 text-xs font-black uppercase
                             hover:border-orange-500 hover:text-orange-500 transition-all">
                {{ size }}
              </button>
            }
          </div>
        </div>

        <!-- Réduction -->
        <div class="border-t border-gray-100 pt-5">
          <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
            Réduction
          </h4>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm font-bold text-gray-700">Avec réduction</span>
            <div (click)="toggleDiscount()"
                 [class.bg-orange-500]="onlyDiscount()"
                 [class.bg-gray-200]="!onlyDiscount()"
                 class="relative w-10 h-5 rounded-full transition-colors cursor-pointer">
              <div [class.translate-x-5]="onlyDiscount()"
                   [class.translate-x-1]="!onlyDiscount()"
                   class="absolute top-0.5 w-4 h-4 bg-white rounded-full
                          shadow transition-transform"></div>
            </div>
          </label>
        </div>

      </div>
    </aside>

    <!-- ===== GRILLE PRODUITS ===== -->
    <div class="flex-1">

      <!-- Sort bar -->
      <div class="flex justify-between items-center mb-5">
        <span class="text-sm font-bold text-gray-400 uppercase tracking-wide">
          {{ products().length }} résultats
        </span>
        <select [(ngModel)]="sortOption" (change)="onSortChange()"
                class="border border-gray-200 rounded-lg px-3 py-2 text-sm
                       bg-white focus:outline-none focus:border-orange-400
                       font-bold text-gray-700 cursor-pointer">
          <option value="default">Trier : Pertinence</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="newest">Nouveautés</option>
          <option value="discount">Meilleures réductions</option>
        </select>
      </div>

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
          <h3 class="text-xl font-black text-gray-700 uppercase mb-2">Aucun produit</h3>
          <p class="text-gray-400 mb-6">Essayez d'autres filtres</p>
          <button (click)="resetFilters()" class="btn-primary">Voir tout</button>
        </div>

      } @else {
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          @for (product of products(); track product.id) {
            <div class="card group hover:shadow-lg transition-all duration-300">
              <a [routerLink]="['/products', product.id]">
                <div class="h-64 bg-gray-50 flex items-center justify-center
                            overflow-hidden relative">
                  @if (product.imageUrl) {
                    <img [src]="product.imageUrl" [alt]="product.name"
                         class="w-full h-full object-cover group-hover:scale-105
                                transition-transform duration-300"/>
                  } @else {
                    <span class="text-6xl">👟</span>
                  }

                  <!-- Badge réduction -->
                  @if (getDiscount(product); as disc) {
                    <span class="absolute top-2 left-2 bg-red-500 text-white
                                 text-xs font-black px-2 py-1 rounded">
                      -{{ disc }}%
                    </span>
                  }

                  <!-- Badge stock faible -->
                  @if (product.stock > 0 && product.stock <= 5) {
                    <span class="absolute bottom-2 right-2 bg-orange-500 text-white
                                 text-xs font-bold px-2 py-1 rounded">
                      {{ product.stock }} restants
                    </span>
                  }

                  <!-- Épuisé -->
                  @if (product.stock === 0) {
                    <div class="absolute inset-0 bg-black/50 flex items-center
                                justify-center">
                      <span class="bg-white text-gray-900 font-black px-3 py-1
                                   rounded text-xs uppercase">Épuisé</span>
                    </div>
                  }

                  <!-- Brand badge -->
                  @if (product.brand) {
                    <span class="absolute top-2 right-2 bg-[#0a1628] text-white
                                 text-xs font-bold px-2 py-1 rounded">
                      {{ product.brand }}
                    </span>
                  }
                </div>
              </a>

              <div class="p-4">
                <a [routerLink]="['/products', product.id]">
                  <h3 class="font-black text-gray-900 mb-1 truncate
                             hover:text-orange-500 transition-colors
                             uppercase text-sm">
                    {{ product.name }}
                  </h3>
                </a>
                <p class="text-xs text-gray-400 font-medium mb-3 uppercase">
                  {{ product.color }}
                  @if (product.size) { · {{ product.size }} }
                </p>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-lg font-black text-[#0a1628]">
                      {{ product.price | number:'1.0-0' }}
                      <span class="text-orange-500 text-sm">MAD</span>
                    </span>
                    @if (product.originalPrice && product.originalPrice > product.price) {
                      <span class="text-xs text-gray-400 line-through ml-1">
                        {{ product.originalPrice | number:'1.0-0' }}
                      </span>
                    }
                  </div>
                  <button (click)="addToCart(product)"
                          [disabled]="product.stock === 0"
                          class="w-9 h-9 bg-[#0a1628] text-white rounded-lg
                                 flex items-center justify-center
                                 hover:bg-orange-500 transition-colors
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
                    class="px-4 py-2 border-2 border-gray-200 rounded-lg
                           font-bold text-sm uppercase disabled:opacity-40
                           hover:border-orange-500 hover:text-orange-500 transition-all">
              ← Prev
            </button>
            @for (p of getPages(); track p) {
              <button (click)="changePage(p)"
                      [class.bg-[#0a1628]]="currentPage() === p"
                      [class.text-white]="currentPage() === p"
                      class="w-10 h-10 border-2 border-gray-200 rounded-lg
                             font-black text-sm hover:border-orange-500
                             hover:text-orange-500 transition-all">
                {{ p + 1 }}
              </button>
            }
            <button (click)="changePage(currentPage() + 1)"
                    [disabled]="currentPage() >= totalPages() - 1"
                    class="px-4 py-2 border-2 border-gray-200 rounded-lg
                           font-bold text-sm uppercase disabled:opacity-40
                           hover:border-orange-500 hover:text-orange-500 transition-all">
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

  readonly products = signal<Product[]>([]);
  readonly allProducts = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly selectedCategory = signal<string | null>(null);
  readonly selectedBrands = signal<string[]>([]);
  readonly selectedSizes = signal<string[]>([]);
  readonly onlyInStock = signal(false);
  readonly onlyDiscount = signal(false);
  readonly priceMin = signal(0);
  readonly priceMax = signal(3000);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly skeletons = [1, 2, 3, 4, 5, 6];

  searchQuery = '';
  sortOption = 'default';
  priceMinValue = 0;
  priceMaxValue = 3000;
  private searchTimeout: any;

  readonly categories = [
    { name: 'Homme',       value: 'HOMME',       icon: '👔' },
    { name: 'Femme',       value: 'FEMME',        icon: '👗' },
    { name: 'Enfant',      value: 'ENFANT',       icon: '🧒' },
    { name: 'Accessoires', value: 'ACCESSOIRES',  icon: '🎒' },
  ];

  readonly sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Marques dynamiques calculées depuis les produits chargés
  readonly availableBrands = computed(() => {
    const all = this.allProducts();
    const map = new Map<string, number>();
    all.forEach(p => {
      if (p.brand) map.set(p.brand, (map.get(p.brand) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory.set(params['category']);
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService
      .getProducts(this.currentPage(), 100, this.selectedCategory())
      .subscribe({
        next: (page) => {
          this.allProducts.set(page.content);
          this.applyClientFilters(page.content);
          this.totalPages.set(page.totalPages);
          this.totalElements.set(page.totalElements);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  private applyClientFilters(source: Product[]): void {
    let results = [...source];

    // Recherche
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Prix
    results = results.filter(p =>
      p.price >= this.priceMin() && p.price <= this.priceMax()
    );

    // Stock
    if (this.onlyInStock()) {
      results = results.filter(p => p.stock > 0);
    }

    // Réduction
    if (this.onlyDiscount()) {
      results = results.filter(p =>
        p.originalPrice && p.originalPrice > p.price
      );
    }

    // Marques
    if (this.selectedBrands().length > 0) {
      results = results.filter(p =>
        p.brand && this.selectedBrands().includes(p.brand)
      );
    }

    // Tailles
    if (this.selectedSizes().length > 0) {
      results = results.filter(p =>
        p.size && this.selectedSizes().includes(p.size)
      );
    }

    // Tri
    switch (this.sortOption) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price); break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price); break;
      case 'newest':
        results.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); break;
      case 'discount':
        results.sort((a, b) =>
          (this.getDiscount(b) ?? 0) - (this.getDiscount(a) ?? 0)
        ); break;
    }

    this.products.set(results);
  }

  getDiscount(product: Product): number | null {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyClientFilters(this.allProducts());
    }, 300);
  }

  onSortChange(): void {
    this.applyClientFilters(this.allProducts());
  }

  onPriceChange(): void {
    this.priceMin.set(Number(this.priceMinValue) || 0);
    this.priceMax.set(Number(this.priceMaxValue) || 3000);
    this.applyClientFilters(this.allProducts());
  }

  onSliderChange(event: Event): void {
    this.priceMaxValue = Number((event.target as HTMLInputElement).value);
    this.priceMax.set(this.priceMaxValue);
    this.applyClientFilters(this.allProducts());
  }

  resetPrice(): void {
    this.priceMinValue = 0;
    this.priceMaxValue = 3000;
    this.priceMin.set(0);
    this.priceMax.set(3000);
    this.applyClientFilters(this.allProducts());
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory.set(category);
    this.currentPage.set(0);
    this.loadProducts();
  }

  toggleBrand(brand: string): void {
    const current = this.selectedBrands();
    this.selectedBrands.set(
      current.includes(brand) ? current.filter(b => b !== brand) : [...current, brand]
    );
    this.applyClientFilters(this.allProducts());
  }

  toggleSize(size: string): void {
    const current = this.selectedSizes();
    this.selectedSizes.set(
      current.includes(size) ? current.filter(s => s !== size) : [...current, size]
    );
    this.applyClientFilters(this.allProducts());
  }

  toggleInStock(): void {
    this.onlyInStock.set(!this.onlyInStock());
    this.applyClientFilters(this.allProducts());
  }

  toggleDiscount(): void {
    this.onlyDiscount.set(!this.onlyDiscount());
    this.applyClientFilters(this.allProducts());
  }

  resetFilters(): void {
    this.selectedCategory.set(null);
    this.selectedBrands.set([]);
    this.selectedSizes.set([]);
    this.onlyInStock.set(false);
    this.onlyDiscount.set(false);
    this.searchQuery = '';
    this.resetPrice();
    this.currentPage.set(0);
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.selectedCategory() ||
      this.selectedBrands().length > 0 ||
      this.selectedSizes().length > 0 ||
      this.onlyInStock() ||
      this.onlyDiscount() ||
      this.searchQuery ||
      this.priceMin() > 0 ||
      this.priceMax() < 3000
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