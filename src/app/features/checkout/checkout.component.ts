import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { OrderRequest } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        Finaliser la commande
      </h1>

      @if (orderSuccess()) {
        <!-- Succès -->
        <div class="text-center py-20">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center
                      justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-green-600" fill="none"
                 stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            Commande confirmée !
          </h2>
          <p class="text-gray-500 mb-8">
            Merci pour votre achat. Livraison sous 24-48h.
          </p>
          <a routerLink="/" class="btn-primary px-8 py-3 text-base">
            Retour à l'accueil
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Formulaire -->
          <div class="lg:col-span-2">
            <div class="card p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-6">
                Informations de livraison
              </h2>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700
                                  mb-1">
                      Nom complet *
                    </label>
                    <input [(ngModel)]="form.name"
                           type="text"
                           placeholder="Votre nom complet"
                           class="input-field"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700
                                  mb-1">
                      Téléphone *
                    </label>
                    <input [(ngModel)]="form.phone"
                           type="tel"
                           placeholder="06XXXXXXXX"
                           class="input-field"/>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input [(ngModel)]="form.email"
                         type="email"
                         placeholder="votre@email.com"
                         class="input-field"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison *
                  </label>
                  <input [(ngModel)]="form.address"
                         type="text"
                         placeholder="Numéro, rue, quartier"
                         class="input-field"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <select [(ngModel)]="form.city" class="input-field">
                    <option value="">Sélectionner une ville</option>
                    @for (city of cities; track city) {
                      <option [value]="city">{{ city }}</option>
                    }
                  </select>
                </div>
              </div>

              <!-- Paiement -->
              <div class="mt-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Mode de paiement
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (method of paymentMethods; track method.value) {
                    <label (click)="selectedPayment = method.value"
                           [class.border-pink-500]="
                             selectedPayment === method.value"
                           [class.bg-pink-50]="
                             selectedPayment === method.value"
                           class="flex items-center gap-3 p-4 border-2
                                  border-gray-200 rounded-xl cursor-pointer
                                  hover:border-pink-300 transition-all">
                      <div class="text-2xl">{{ method.icon }}</div>
                      <div>
                        <div class="font-medium text-sm text-gray-800">
                          {{ method.label }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ method.description }}
                        </div>
                      </div>
                    </label>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Résumé -->
          <div>
            <div class="card p-6 sticky top-20">
              <h2 class="text-lg font-bold text-gray-900 mb-4">
                Votre commande
              </h2>
              <div class="space-y-3 mb-4 max-h-48 overflow-y-auto">
                @for (item of cart.cartItems(); track item.product.id) {
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 truncate flex-1 mr-2">
                      {{ item.product.name }}
                      <span class="text-gray-400">×{{ item.quantity }}</span>
                    </span>
                    <span class="font-medium shrink-0">
                      {{ item.product.price * item.quantity
                         | number:'1.0-0' }} MAD
                    </span>
                  </div>
                }
              </div>
              <div class="border-t pt-3 space-y-2 text-sm mb-6">
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
                <div class="flex justify-between font-bold text-base
                            text-gray-900">
                  <span>Total</span>
                  <span class="text-pink-600">
                    {{ cart.finalTotal() | number:'1.0-0' }} MAD
                  </span>
                </div>
              </div>

              @if (error()) {
                <div class="bg-red-50 text-red-600 text-sm p-3
                            rounded-lg mb-4">
                  {{ error() }}
                </div>
              }

              <button (click)="placeOrder()"
                      [disabled]="submitting() || cart.cartItems().length === 0"
                      class="btn-primary w-full py-3 text-base
                             disabled:opacity-50 disabled:cursor-not-allowed">
                @if (submitting()) {
                  <span class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"
                         fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373
                               0 12h4z"/>
                    </svg>
                    Traitement...
                  </span>
                } @else {
                  Confirmer la commande
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CheckoutComponent {

  readonly cart = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly orderSuccess = signal(false);
  readonly error = signal<string | null>(null);

  selectedPayment = 'cash';

  form = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  };

  readonly cities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès',
    'Tanger', 'Agadir', 'Oujda', 'Meknès',
    'Kénitra', 'Tétouan', 'Safi', 'El Jadida',
    'Berrechid', 'Khouribga', 'Nador', 'Beni Mellal',
    'Settat', 'Larache', 'Ksar El Kebir', 'Taza',
    'Guelmim', 'Ouarzazate', 'Dakhla',
  ];

  readonly paymentMethods = [
    {
      value: 'cmi',
      icon: '💳',
      label: 'Carte bancaire',
      description: 'Paiement sécurisé via Stripe'
    },
    {
      value: 'cash',
      icon: '💵',
      label: 'À la livraison',
      description: 'Cash ou chèque'
    }
  ];
  private isFormValid(): boolean {
  return !!(
    this.form.name &&
    this.form.phone &&
    this.form.address &&
    this.form.city
  );
}

  placeOrder(): void {
    if (!this.isFormValid()) {
      this.error.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);

    if (this.selectedPayment === 'cash') {
      this.placeOrderCash();
    } else {
      this.placeOrderStripe();
    }
  }

  private placeOrderCash(): void {
    const orderData: OrderRequest = {
      items: this.cart.cartItems().map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      })),
      shippingAddress: this.form.address,
      city: this.form.city,
      phone: this.form.phone,
      paymentMethod: 'CASH'
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.cart.clearCart();
        this.orderSuccess.set(true);
        this.submitting.set(false);
      },
      error: () => {
        this.error.set('Erreur lors de la commande. Réessayez.');
        this.submitting.set(false);
      }
    });
  }
private placeOrderStripe(): void {
  // Calculer le total
  const total = this.cart.finalTotal();

  this.orderService.createStripeCheckout({
    amount: total,
    currency: 'mad',
    description: 'Commande SaadStore',
    items: this.cart.cartItems().map(i => ({
      productId: i.product.id,
      quantity: i.quantity
    })),
    shippingAddress: this.form.address,
    city: this.form.city,
    phone: this.form.phone
  }).subscribe({
    next: (res: any) => {
      // Stripe retourne cmiPaymentUrl
      const url = res.cmiPaymentUrl || res.url;
      if (url) {
        window.location.href = url;
      } else {
        this.error.set('URL de paiement manquante.');
        this.submitting.set(false);
      }
    },
    error: (err) => {
      console.error('Stripe error:', err);
      this.error.set('Erreur paiement. Vérifiez la console.');
      this.submitting.set(false);
    }
  });
}
}