import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">S</span>
            </div>
            <span class="text-xl font-bold text-gray-900">SaadStore</span>
          </a>
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/"
               routerLinkActive="text-pink-600"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-600 hover:text-pink-600 font-medium transition-colors">
              Accueil
            </a>
            <a routerLink="/catalogue"
               routerLinkActive="text-pink-600"
               class="text-gray-600 hover:text-pink-600 font-medium transition-colors">
              Catalogue
            </a>
          </div>
          <div class="flex items-center gap-4">
            <a routerLink="/cart" class="relative p-2 text-gray-600 hover:text-pink-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              @if (cart.totalItems() > 0) {
                <span class="absolute -top-1 -right-1 bg-pink-600 text-white
                             text-xs w-5 h-5 rounded-full flex items-center
                             justify-center font-bold">
                  {{ cart.totalItems() }}
                </span>
              }
            </a>
            <a routerLink="/admin" class="hidden md:block btn-primary text-sm py-2">
              Admin
            </a>
            <button (click)="menuOpen = !menuOpen"
                    class="md:hidden p-2 text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
        @if (menuOpen) {
          <div class="md:hidden py-4 border-t border-gray-100 space-y-2">
            <a routerLink="/" (click)="menuOpen = false"
               class="block px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg">
              Accueil
            </a>
            <a routerLink="/catalogue" (click)="menuOpen = false"
               class="block px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg">
              Catalogue
            </a>
            <a routerLink="/admin" (click)="menuOpen = false"
               class="block px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg">
              Admin
            </a>
          </div>
        }
      </div>
    </nav>
  `
})
export class NavbarComponent {
  cart = inject(CartService);
  menuOpen = false;
}