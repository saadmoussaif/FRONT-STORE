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
<!-- HERO -->
<section class="bg-[#0a1628] min-h-[90vh] flex items-center
                overflow-hidden relative">

  <!-- Background pattern -->
  <div class="absolute inset-0 opacity-5">
    <div class="absolute top-0 right-0 w-96 h-96 bg-orange-500
                rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500
                rounded-full blur-2xl"></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative
              w-full">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      <!-- Text -->
      <div>
        <span class="inline-flex items-center gap-2 bg-orange-500/10
                     border border-orange-500/30 text-orange-400
                     text-xs font-bold px-4 py-2 rounded-full mb-6
                     uppercase tracking-widest">
          ⚡ Nouvelle collection 2026
        </span>
        <h1 class="text-5xl lg:text-7xl font-black text-white
                   leading-none mb-6 uppercase tracking-tight">
          JUST <span class="text-orange-500">DO</span>
          <br>IT YOUR
          <br><span class="text-orange-500">WAY</span>
        </h1>
        <p class="text-gray-400 text-lg mb-8 leading-relaxed
                  font-medium max-w-md">
          Performance maximale. Style iconique.
          Vêtements de sport pour les vrais athlètes.
        </p>
        <div class="flex flex-wrap gap-4">
          <a routerLink="/catalogue"
             class="btn-primary text-base px-8 py-4">
            SHOP NOW →
          </a>
          <a routerLink="/catalogue"
             class="border-2 border-gray-600 text-gray-300
                    px-8 py-4 rounded-lg font-bold uppercase
                    text-base hover:border-orange-500
                    hover:text-orange-500 transition-all">
            EXPLORER
          </a>
        </div>

        <!-- Brands -->
        <div class="flex items-center gap-6 mt-12">
          <span class="text-gray-600 text-xs uppercase tracking-widest">
            Brands
          </span>
          <div class="flex items-center gap-4">
            @for (brand of brands; track brand) {
              <span class="text-gray-500 font-black text-sm
                           hover:text-white transition-colors
                           cursor-pointer uppercase tracking-tight">
                {{ brand }}
              </span>
            }
          </div>
        </div>

        <!-- Stats -->
        <div class="flex gap-8 mt-10 pt-8 border-t border-gray-800">
          <div>
            <div class="text-3xl font-black text-white">500+</div>
            <div class="text-xs text-gray-500 font-bold uppercase
                        tracking-widest">Produits</div>
          </div>
          <div class="w-px bg-gray-800"></div>
          <div>
            <div class="text-3xl font-black text-white">10k+</div>
            <div class="text-xs text-gray-500 font-bold uppercase
                        tracking-widest">Clients</div>
          </div>
          <div class="w-px bg-gray-800"></div>
          <div>
            <div class="text-3xl font-black text-white">24h</div>
            <div class="text-xs text-gray-500 font-bold uppercase
                        tracking-widest">Livraison</div>
          </div>
        </div>
      </div>

     <div class="hidden lg:block relative">
  <div class="w-full h-[520px] rounded-2xl overflow-hidden relative border border-gray-800">

    <!-- IMAGE -->
    <div class="hidden lg:block relative">
  <div 
    class="w-full h-[520px] rounded-2xl overflow-hidden relative border border-gray-800 group"
    (mouseenter)="start360()"
    (mouseleave)="stop360()"
  >

    <!-- IMAGE -->
    <img 
      [src]="images[currentImageIndex()]"
      class="w-full h-full object-cover transition-opacity duration-300"
    />

    <!-- OVERLAY -->
    <div class="absolute inset-0 bg-black/20"></div>

    <!-- TEXTE -->
    <div class="absolute bottom-6 left-6 text-white z-10">
      <div class="text-2xl font-black uppercase">Nike</div>
      <div class="text-orange-500 text-sm uppercase">Collection 2026</div>
    </div>

  </div>
</div>

    <!-- BOUTON PREV -->
    <button (click)="prevImage()"
      class="absolute left-4 top-1/2 -translate-y-1/2
             bg-black/50 hover:bg-black text-white
             w-10 h-10 rounded-full flex items-center justify-center">
      ‹
    </button>

    <!-- BOUTON NEXT -->
    <button (click)="nextImage()"
      class="absolute right-4 top-1/2 -translate-y-1/2
             bg-black/50 hover:bg-black text-white
             w-10 h-10 rounded-full flex items-center justify-center">
      ›
    </button>

    <!-- DOTS -->
    div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
  @for (img of images; track img; let i = $index) {
    <div 
      (click)="currentImageIndex.set(i)"
      class="w-2.5 h-2.5 rounded-full cursor-pointer"
      [class.bg-orange-500]="currentImageIndex() === i"
      [class.bg-white/40]="currentImageIndex() !== i">
    </div>
  }
</div>

  </div>
</div>
        <!-- Badge livraison -->
        
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
  readonly brands = ['Nike', 'Adidas', 'Puma', 'New Balance'];

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
  currentImageIndex = signal(0);

images = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200',
  'https://images.unsplash.com/photo-1593032465171-8c1f92c5d0b4?q=80&w=1200',
  'https://images.unsplash.com/photo-1584735175097-719d848f8449?q=80&w=1200'
];

nextImage() {
  this.currentImageIndex.update(i => (i + 1) % this.images.length);
}

prevImage() {
  this.currentImageIndex.update(i => 
    i === 0 ? this.images.length - 1 : i - 1
  );
}
  hoverInterval: any = null;

start360() {
  if (this.hoverInterval) return;

  this.hoverInterval = setInterval(() => {
    this.currentImageIndex.update(i => (i + 1) % this.images.length);
  }, 800); // vitesse réaliste
}

stop360() {
  if (this.hoverInterval) {
    clearInterval(this.hoverInterval);
    this.hoverInterval = null;
  }
}
}