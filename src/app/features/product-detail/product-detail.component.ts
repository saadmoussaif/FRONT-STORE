import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a routerLink="/" class="hover:text-pink-600 transition-colors">
          Accueil
        </a>
        <span>/</span>
        <a routerLink="/catalogue"
           class="hover:text-pink-600 transition-colors">
          Catalogue
        </a>
        <span>/</span>
        <span class="text-gray-900 font-medium truncate max-w-xs">
          {{ product()?.name }}
        </span>
      </nav>

      @if (loading()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div class="h-96 bg-gray-200 rounded-2xl"></div>
          <div class="space-y-4 pt-4">
            <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      } @else if (product()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <!-- Image -->
          <div class="h-96 lg:h-[500px] bg-gradient-to-br from-gray-100
                      to-gray-200 rounded-2xl flex items-center
                      justify-center overflow-hidden">
            @if (product()!.imageUrl) {
              <img [src]="product()!.imageUrl"
                   [alt]="product()!.name"
                   class="w-full h-full object-cover"/>
            } @else {
              <span class="text-9xl">👕</span>
            }
          </div>

          <!-- Infos -->
          <div class="flex flex-col justify-center">
            <span class="badge bg-pink-100 text-pink-700 w-fit mb-4 text-sm">
              {{ product()!.category }}
            </span>
            <h1 class="text-3xl font-bold text-gray-900 mb-3">
              {{ product()!.name }}
            </h1>
            <p class="text-gray-500 mb-6 leading-relaxed">
              {{ product()!.description }}
            </p>

            <!-- Details -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-xs text-gray-400 mb-1">Couleur</div>
                <div class="font-semibold text-gray-800">
                  {{ product()!.color }}
                </div>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-xs text-gray-400 mb-1">Taille</div>
                <div class="font-semibold text-gray-800">
                  {{ product()!.size }}
                </div>
              </div>
            </div>

            <!-- Stock status -->
            <div class="mb-6">
              @if (product()!.stock > 5) {
                <span class="flex items-center gap-2 text-green-600 text-sm
                             font-medium">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  En stock ({{ product()!.stock }} disponibles)
                </span>
              } @else if (product()!.stock > 0) {
                <span class="flex items-center gap-2 text-orange-600 text-sm
                             font-medium">
                  <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Dernières pièces : {{ product()!.stock }} restantes
                </span>
              } @else {
                <span class="flex items-center gap-2 text-red-600 text-sm
                             font-medium">
                  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                  Rupture de stock
                </span>
              }
            </div>

            <!-- Prix + Actions -->
            <div class="border-t border-gray-100 pt-6">
              <div class="text-4xl font-bold text-pink-600 mb-6">
                {{ product()!.price | number:'1.0-0' }} MAD
              </div>

              <!-- Quantité -->
              <div class="flex items-center gap-4 mb-6">
                <span class="text-sm font-medium text-gray-700">
                  Quantité
                </span>
                <div class="flex items-center border border-gray-300
                            rounded-lg overflow-hidden">
                  <button (click)="decreaseQty()"
                          class="w-10 h-10 flex items-center justify-center
                                 hover:bg-gray-50 transition-colors
                                 text-gray-600 text-lg">
                    −
                  </button>
                  <span class="w-12 text-center font-semibold text-gray-900">
                    {{ quantity() }}
                  </span>
                  <button (click)="increaseQty()"
                          class="w-10 h-10 flex items-center justify-center
                                 hover:bg-gray-50 transition-colors
                                 text-gray-600 text-lg">
                    +
                  </button>
                </div>
              </div>

              <div class="flex gap-4">
                <button (click)="addToCart()"
                        [disabled]="product()!.stock === 0"
                        class="flex-1 btn-primary py-3 text-base
                               disabled:opacity-40 disabled:cursor-not-allowed">
                  Ajouter au panier
                </button>
                <a routerLink="/cart"
                   class="flex-1 btn-secondary py-3 text-base text-center">
                  Voir le panier
                </a>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-20">
          <div class="text-6xl mb-4">😕</div>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Produit introuvable
          </h2>
          <a routerLink="/catalogue" class="btn-primary">
            Retour au catalogue
          </a>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {

  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);

  // ============ STATE ============
  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly quantity = signal(1);

  // ============ LIFECYCLE ============
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadProduct(id);
  }

  // ============ METHODS ============
  private loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  increaseQty(): void {
    const max = this.product()?.stock ?? 1;
    if (this.quantity() < max) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    const p = this.product();
    if (p) this.cartService.addToCart(p, this.quantity());
  }
}