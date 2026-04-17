import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="bg-white/95 backdrop-blur-sm sticky top-0 z-50
                border-b border-pink-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <div class="w-9 h-9 bg-gradient-to-br from-pink-500
                        to-rose-500 rounded-xl flex items-center
                        justify-center shadow-md
                        group-hover:shadow-pink-200
                        group-hover:scale-105 transition-all">
              <span class="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <span class="text-xl font-bold bg-gradient-to-r
                           from-pink-600 to-rose-500
                           bg-clip-text text-transparent">
                SaadStore
              </span>
              <div class="text-xs text-pink-400 font-medium
                          -mt-1 hidden md:block">
                Sport & Style
              </div>
            </div>
          </a>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/"
               routerLinkActive="text-pink-600 font-semibold"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-500 hover:text-pink-600 font-medium
                      transition-colors relative group">
              Accueil
              <span class="absolute -bottom-1 left-0 w-0 h-0.5
                           bg-pink-500 group-hover:w-full
                           transition-all duration-300"></span>
            </a>
            <a routerLink="/catalogue"
               routerLinkActive="text-pink-600 font-semibold"
               class="text-gray-500 hover:text-pink-600 font-medium
                      transition-colors relative group">
              Catalogue
              <span class="absolute -bottom-1 left-0 w-0 h-0.5
                           bg-pink-500 group-hover:w-full
                           transition-all duration-300"></span>
            </a>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">

            <!-- Panier -->
            <a routerLink="/cart"
               class="relative p-2.5 text-gray-500
                      hover:text-pink-600 hover:bg-pink-50
                      rounded-xl transition-all duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              @if (cart.totalItems() > 0) {
                <span class="absolute -top-1 -right-1
                             bg-gradient-to-r from-pink-500 to-rose-500
                             text-white text-xs w-5 h-5 rounded-full
                             flex items-center justify-center
                             font-bold shadow-md animate-pulse">
                  {{ cart.totalItems() }}
                </span>
              }
            </a>

            <!-- Admin connecté -->
            @if (auth.isLoggedIn() && auth.isAdmin()) {
              <div class="hidden md:flex items-center gap-2">
                <a routerLink="/admin"
                   class="flex items-center gap-1.5 text-sm
                          font-medium text-pink-600 hover:text-pink-700
                          bg-pink-50 hover:bg-pink-100 px-4 py-2
                          rounded-full transition-all duration-200">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756
                             3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94
                             3.31.826 2.37 2.37a1.724 1.724 0 001.065
                             2.572c1.756.426 1.756 2.924 0 3.35a1.724
                             1.724 0 00-1.066 2.573c.94 1.543-.826
                             3.31-2.37 2.37a1.724 1.724 0 00-2.572
                             1.065c-.426 1.756-2.924 1.756-3.35
                             0a1.724 1.724 0 00-2.573-1.066c-1.543.94
                             -3.31-.826-2.37-2.37a1.724 1.724 0
                             00-1.065-2.572c-1.756-.426-1.756-2.924
                             0-3.35a1.724 1.724 0 001.066-2.573c-.94
                             -1.543.826-3.31 2.37-2.37.996.608 2.296.07
                             2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Dashboard
                </a>
                <button (click)="logout()"
                        class="text-sm text-gray-400 hover:text-red-500
                               transition-colors px-2 py-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
                             01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3
                             3 0 013 3v1"/>
                  </svg>
                </button>
              </div>
            }

            <!-- Mobile menu -->
            <button (click)="toggleMenu()"
                    class="md:hidden p-2 text-gray-500
                           hover:text-pink-600 hover:bg-pink-50
                           rounded-xl transition-all">
              <svg class="w-6 h-6" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        @if (menuOpen) {
          <div class="md:hidden py-4 border-t border-pink-50 space-y-1">
            <a routerLink="/" (click)="menuOpen = false"
               class="block px-4 py-2.5 text-gray-600
                      hover:bg-pink-50 hover:text-pink-600
                      rounded-xl transition-colors font-medium">
              🏠 Accueil
            </a>
            <a routerLink="/catalogue" (click)="menuOpen = false"
               class="block px-4 py-2.5 text-gray-600
                      hover:bg-pink-50 hover:text-pink-600
                      rounded-xl transition-colors font-medium">
              👗 Catalogue
            </a>
            <a routerLink="/cart" (click)="menuOpen = false"
               class="block px-4 py-2.5 text-gray-600
                      hover:bg-pink-50 hover:text-pink-600
                      rounded-xl transition-colors font-medium">
              🛒 Panier
              @if (cart.totalItems() > 0) {
                <span class="ml-2 bg-pink-500 text-white text-xs
                             px-2 py-0.5 rounded-full">
                  {{ cart.totalItems() }}
                </span>
              }
            </a>
            @if (auth.isLoggedIn() && auth.isAdmin()) {
              <a routerLink="/admin" (click)="menuOpen = false"
                 class="block px-4 py-2.5 text-pink-600
                        hover:bg-pink-50 rounded-xl
                        transition-colors font-medium">
                ⚙️ Dashboard Admin
              </a>
              <button (click)="logout()"
                      class="w-full text-left px-4 py-2.5 text-red-500
                             hover:bg-red-50 rounded-xl transition-colors">
                🚪 Déconnexion
              </button>
            }
          </div>
        }
      </div>

      <!-- Bouton Espace Admin discret en bas de navbar -->
      <div class="border-t border-pink-50 bg-gradient-to-r
                  from-pink-50/50 to-rose-50/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-end py-1">
            @if (!auth.isLoggedIn()) {
              <button (click)="loginAdmin()"
                      class="flex items-center gap-1 text-xs
                             text-gray-300 hover:text-pink-400
                             transition-colors py-0.5 px-2 rounded
                             hover:bg-pink-50">
                <svg class="w-3 h-3" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
                           00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10
                           -10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Espace Admin
              </button>
            }
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  loginAdmin(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }
}