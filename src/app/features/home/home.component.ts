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
<section class="bg-gradient-to-br from-pink-50 via-white to-rose-50
                min-h-[90vh] flex items-center overflow-hidden relative">

  <!-- Cercles décoratifs -->
  <div class="absolute top-20 right-10 w-72 h-72 bg-pink-200/30
              rounded-full blur-3xl"></div>
  <div class="absolute bottom-10 left-10 w-48 h-48 bg-rose-200/30
              rounded-full blur-2xl"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      <!-- Text -->
      <div>
        <span class="inline-flex items-center gap-2 bg-pink-100
                     text-pink-700 text-sm font-semibold px-4 py-2
                     rounded-full mb-6">
          <span class="w-2 h-2 bg-pink-500 rounded-full
                       animate-pulse"></span>
          Nouvelle collection Sport 2026
        </span>
        <h1 class="text-5xl lg:text-6xl font-extrabold text-gray-900
                   leading-tight mb-6">
          Bouge avec
          <span class="bg-gradient-to-r from-pink-600 to-rose-500
                       bg-clip-text text-transparent"> Style</span>
          💪
        </h1>
        <p class="text-lg text-gray-500 mb-8 leading-relaxed">
          Vêtements de sport et lifestyle pensés pour la femme active.
          Performance, confort et élégance réunis.
        </p>
        <div class="flex flex-wrap gap-4">
          <a routerLink="/catalogue"
             class="btn-primary text-base px-8 py-3.5
                    flex items-center gap-2">
            <span>🛍️</span> Découvrir
          </a>
          <a routerLink="/catalogue"
             class="btn-secondary text-base px-8 py-3.5">
            Nouveautés →
          </a>
        </div>

        <!-- Stats -->
        <div class="flex gap-8 mt-12">
          <div class="text-center">
            <div class="text-2xl font-extrabold bg-gradient-to-r
                        from-pink-600 to-rose-500 bg-clip-text
                        text-transparent">500+</div>
            <div class="text-xs text-gray-400 font-medium mt-1">
              Produits
            </div>
          </div>
          <div class="w-px bg-pink-100"></div>
          <div class="text-center">
            <div class="text-2xl font-extrabold bg-gradient-to-r
                        from-pink-600 to-rose-500 bg-clip-text
                        text-transparent">10k+</div>
            <div class="text-xs text-gray-400 font-medium mt-1">
              Clientes
            </div>
          </div>
          <div class="w-px bg-pink-100"></div>
          <div class="text-center">
            <div class="text-2xl font-extrabold bg-gradient-to-r
                        from-pink-600 to-rose-500 bg-clip-text
                        text-transparent">24h</div>
            <div class="text-xs text-gray-400 font-medium mt-1">
              Livraison
            </div>
          </div>
        </div>
      </div>

      <!-- Image hero -->
      <div class="hidden lg:block relative">
        <div class="w-full h-[500px] bg-gradient-to-br from-pink-200
                    via-rose-100 to-pink-300 rounded-[3rem]
                    flex items-center justify-center relative
                    overflow-hidden shadow-2xl shadow-pink-200">
          <div class="text-center relative z-10">
            <div class="text-9xl mb-4 animate-bounce">👟</div>
            <p class="text-pink-700 font-bold text-xl">
              Sport & Lifestyle
            </p>
            <p class="text-pink-500 text-sm mt-1">
              Collection 2026
            </p>
          </div>
          <!-- Decorations -->
          <div class="absolute top-8 right-8 text-4xl
                      animate-spin-slow">⚡</div>
          <div class="absolute bottom-8 left-8 text-3xl">🏃‍♀️</div>
        </div>

        <!-- Badge flottant -->
        <div class="absolute -bottom-4 -left-4 bg-white rounded-2xl
                    shadow-xl p-4 flex items-center gap-3 border
                    border-pink-100">
          <div class="w-10 h-10 bg-green-100 rounded-full flex
                      items-center justify-center">
            <span class="text-green-600">✓</span>
          </div>
          <div>
            <div class="font-bold text-sm text-gray-800">
              Livraison gratuite
            </div>
            <div class="text-xs text-gray-400">Dès 500 MAD</div>
          </div>
        </div>

        <!-- Badge 2 -->
        <div class="absolute -top-4 -right-4 bg-gradient-to-r
                    from-pink-500 to-rose-500 rounded-2xl shadow-xl
                    p-4 text-white text-center">
          <div class="font-extrabold text-lg">-20%</div>
          <div class="text-xs text-pink-100">Collection</div>
        </div>
      </div>
    </div>
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