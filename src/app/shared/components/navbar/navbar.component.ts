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
    <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-pink-600 rounded-lg flex items-center
                        justify-center">
              <span class="text-white font-bold text-sm">S</span>
            </div>
            <span class="text-xl font-bold text-gray-900">SaadStore</span>
          </a>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/"
               routerLinkActive="text-pink-600"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-600 hover:text-pink-600 font-medium
                      transition-colors">
              Accueil
            </a>
            <a routerLink="/catalogue"
               routerLinkActive="text-pink-600"
               class="text-gray-600 hover:text-pink-600 font-medium
                      transition-colors">
              Catalogue
            </a>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">

            <!-- Panier -->
            <a routerLink="/cart"
               class="relative p-2 text-gray-600 hover:text-pink-600
                      transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              @if (cart.totalItems() > 0) {
                <span class="absolute -top-1 -right-1 bg-pink-600
                             text-white text-xs w-5 h-5 rounded-full
                             flex items-center justify-center font-bold">
                  {{ cart.totalItems() }}
                </span>
              }
            </a>

            <!-- Connecté -->
            @if (auth.isLoggedIn()) {
              <div class="relative hidden md:block">
                <button (click)="userMenuOpen = !userMenuOpen"
                        class="flex items-center gap-2 px-3 py-2
                               rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="w-8 h-8 bg-pink-100 rounded-full flex
                              items-center justify-center">
                    <span class="text-pink-600 font-semibold text-sm">
                      {{ auth.userName().charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <span class="text-sm font-medium text-gray-700">
                    {{ auth.userName() }}
                  </span>
                  <svg class="w-4 h-4 text-gray-400" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                @if (userMenuOpen) {
                  <div class="absolute right-0 mt-2 w-52 bg-white
                              rounded-xl shadow-lg border border-gray-100
                              py-1 z-50">
                    @if (auth.isAdmin()) {
                      <a routerLink="/admin"
                         (click)="userMenuOpen = false"
                         class="flex items-center gap-2 px-4 py-2.5
                                text-sm text-gray-700 hover:bg-pink-50
                                hover:text-pink-600 transition-colors">
                        ⚙️ Dashboard Admin
                      </a>
                    }
                    <div class="border-t border-gray-100 my-1"></div>
                    <button (click)="logout()"
                            class="w-full flex items-center gap-2 px-4
                                   py-2.5 text-sm text-red-600
                                   hover:bg-red-50 transition-colors">
                      🚪 Déconnexion
                    </button>
                  </div>
                }
              </div>

            } @else {
              <!-- Non connecté -->
              <div class="hidden md:flex items-center gap-2">
                <button (click)="login()"
                        class="btn-secondary text-sm py-2 px-4">
                  Connexion
                </button>
                <button (click)="register()"
                        class="btn-primary text-sm py-2 px-4">
                  S'inscrire
                </button>
              </div>
            }

            <!-- Mobile menu -->
            <button (click)="toggleMenu()"
                    class="md:hidden p-2 text-gray-600">
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
          <div class="md:hidden py-4 border-t border-gray-100 space-y-1">
            <a routerLink="/" (click)="menuOpen = false"
               class="block px-4 py-2.5 text-gray-700 hover:bg-pink-50
                      hover:text-pink-600 rounded-lg transition-colors">
              Accueil
            </a>
            <a routerLink="/catalogue" (click)="menuOpen = false"
               class="block px-4 py-2.5 text-gray-700 hover:bg-pink-50
                      hover:text-pink-600 rounded-lg transition-colors">
              Catalogue
            </a>
            @if (auth.isLoggedIn()) {
              @if (auth.isAdmin()) {
                <a routerLink="/admin" (click)="menuOpen = false"
                   class="block px-4 py-2.5 text-gray-700 hover:bg-pink-50
                          hover:text-pink-600 rounded-lg transition-colors">
                  Admin
                </a>
              }
              <button (click)="logout()"
                      class="w-full text-left px-4 py-2.5 text-red-600
                             hover:bg-red-50 rounded-lg transition-colors">
                Déconnexion
              </button>
            } @else {
              <button (click)="login()"
                      class="w-full text-left px-4 py-2.5 text-gray-700
                             hover:bg-pink-50 hover:text-pink-600
                             rounded-lg transition-colors">
                Connexion
              </button>
              <button (click)="register()"
                      class="w-full text-left px-4 py-2.5 text-pink-600
                             font-medium hover:bg-pink-50 rounded-lg
                             transition-colors">
                S'inscrire
              </button>
            }
          </div>
        }
      </div>
    </nav>
  `
})
export class NavbarComponent {

  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);

  menuOpen = false;
  userMenuOpen = false;

  // ============ METHODS ============
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  login(): void {
    this.auth.login();
  }

  register(): void {
    this.auth.register();
  }

  logout(): void {
    this.userMenuOpen = false;
    this.auth.logout();
  }
}