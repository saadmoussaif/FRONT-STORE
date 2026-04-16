import { Product } from './product.model';

export type OrderStatus =
  'PENDING' | 'PAID' | 'PROCESSING' |
  'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  city: string;
  phone: string;
  items: OrderItem[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
export interface OrderRequest {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
  city: string;
  phone: string;
  paymentMethod?: 'CASH' | 'CMI' | 'STRIPE';
   customerEmail?: string;
  customerName?: string;
}

