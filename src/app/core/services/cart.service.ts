import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly _items = signal<CartItem[]>([]);

  readonly cartItems = this._items.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  readonly shippingCost = computed(() =>
    this.totalPrice() >= 500 ? 0 : 50
  );

  readonly finalTotal = computed(() =>
    this.totalPrice() + this.shippingCost()
  );

  addToCart(product: Product, quantity = 1): void {
    const current = this._items();
    const existing = current.find(i => i.product.id === product.id);
    if (existing) {
      this._items.set(
        current.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      this._items.set([...current, { product, quantity }]);
    }
  }

  removeFromCart(productId: string): void {
    this._items.set(this._items().filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.set(
      this._items().map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  clearCart(): void {
    this._items.set([]);
  }

  isInCart(productId: string): boolean {
    return this._items().some(i => i.product.id === productId);
  }
}