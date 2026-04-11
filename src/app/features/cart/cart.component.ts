import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon panier</h1>

      @if (cart.cartItems().length === 0) {
        <!-- Panier vide -->
        <div class="text-center py-20">
          <div class="text-7xl mb-6">🛒</div>
          <h2 class="text-2xl font-semibold text-gray-700 mb-3">
            Votre panier est vide
          </h2>
          <p class="text-gray-400 mb-8">
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
          <a routerLink="/catalogue" class="btn-primary px-8 py-3 text-base">
            Continuer mes achats
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Liste articles -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of cart.cartItems(); track item.product.id) {
              <div class="card p-4 flex gap-4 items-center">

                <!-- Image -->
                <div class="w-20 h-20 bg-gray-100 rounded-xl flex items-center
                            justify-center shrink-0 overflow-hidden">
                  @if (item.product.imageUrl) {
                    <img [src]="item.product.imageUrl"
                         [alt]="item.product.name"
                         class="w-full h-full object-cover"/>
                  } @else {
                    <span class="text-3xl">👕</span>
                  }
                </div>

                <!-- Infos -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 truncate text-sm">
                    {{ item.product.name }}
                  </h3>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ item.product.color }} · {{ item.product.size }}
                  </p>
                  <p class="text-pink-600 font-bold mt-1 text-sm">
                    {{ item.product.price | number:'1.0-0' }} MAD
                  </p>
                </div>

                <!-- Quantité -->
                <div class="flex items-center border border-gray-200
                            rounded-lg overflow-hidden shrink-0">
                  <button (click)="updateQty(item.product.id,
                                             item.quantity - 1)"
                          class="w-8 h-8 flex items-center justify-center
                                 hover:bg-gray-50 transition-colors
                                 text-gray-600">
                    −
                  </button>
                  <span class="w-8 text-center text-sm font-semibold
                               text-gray-900">
                    {{ item.quantity }}
                  </span>
                  <button (click)="updateQty(item.product.id,
                                             item.quantity + 1)"
                          class="w-8 h-8 flex items-center justify-center
                                 hover:bg-gray-50 transition-colors
                                 text-gray-600">
                    +
                  </button>
                </div>

                <!-- Sous-total + Supprimer -->
                <div class="text-right shrink-0">
                  <p class="font-bold text-gray-900 text-sm">
                    {{ item.product.price * item.quantity
                       | number:'1.0-0' }} MAD
                  </p>
                  <button (click)="removeItem(item.product.id)"
                          class="text-red-400 hover:text-red-600 text-xs
                                 mt-1 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            }

            <!-- Actions bas -->
            <div class="flex justify-between items-center pt-2">
              <button (click)="clearCart()"
                      class="text-sm text-gray-400 hover:text-red-500
                             transition-colors">
                Vider le panier
              </button>
              <a routerLink="/catalogue"
                 class="text-sm text-pink-600 hover:text-pink-700
                        font-medium transition-colors">
                ← Continuer mes achats
              </a>
            </div>
          </div>

          <!-- Résumé commande -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-20">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Résumé</h2>

              <div class="space-y-3 text-sm mb-6">
                <div class="flex justify-between text-gray-600">
                  <span>
                    Sous-total ({{ cart.totalItems() }} articles)
                  </span>
                  <span>
                    {{ cart.totalPrice() | number:'1.0-0' }} MAD
                  </span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span [class.text-green-600]="cart.shippingCost() === 0">
                    @if (cart.shippingCost() === 0) {
                      Gratuite
                    } @else {
                      {{ cart.shippingCost() }} MAD
                    }
                  </span>
                </div>
                <div class="border-t pt-3 flex justify-between font-bold
                            text-gray-900 text-base">
                  <span>Total</span>
                  <span class="text-pink-600">
                    {{ cart.finalTotal() | number:'1.0-0' }} MAD
                  </span>
                </div>
              </div>

              @if (cart.shippingCost() > 0) {
                <div class="bg-pink-50 rounded-lg p-3 text-xs
                            text-pink-700 mb-4">
                  Plus que
                  {{ 500 - cart.totalPrice() | number:'1.0-0' }} MAD
                  pour la livraison gratuite !
                </div>
              }

              <a routerLink="/checkout"
                 class="btn-primary w-full text-center block py-3 text-base">
                Commander
                ({{ cart.finalTotal() | number:'1.0-0' }} MAD)
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CartComponent {

  readonly cart = inject(CartService);

  // ============ METHODS ============
  updateQty(productId: string, qty: number): void {
    this.cart.updateQuantity(productId, qty);
  }

  removeItem(productId: string): void {
    this.cart.removeFromCart(productId);
  }

  clearCart(): void {
    this.cart.clearCart();
  }
}