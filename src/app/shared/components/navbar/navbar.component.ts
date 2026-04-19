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


 <div class="bg-orange-500 text-white text-center py-2 text-xs
              font-black uppercase tracking-widest">
    🚚 LIVRAISON GRATUITE DÈS 500 MAD 
    
  </div>
    <nav class="bg-[#0a1628] sticky top-0 z-50 shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="w-9 h-9 bg-orange-500 rounded-lg flex
                        items-center justify-center font-black
                        text-white text-lg group-hover:bg-orange-400
                        transition-colors">
              S
            </div>
            <div>
              <span class="text-white font-black text-xl
                           tracking-tight uppercase">
                Saad
              </span>
              <span class="text-orange-500 font-black text-xl
                           tracking-tight uppercase">
                Store
              </span>
              <div class="text-gray-400 text-xs font-medium
                          uppercase tracking-widest -mt-1">
                Sport & Gear
              </div>
            </div>
          </a>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/"
               routerLinkActive="text-orange-500"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-300 hover:text-orange-500
                      font-bold uppercase text-sm tracking-wide
                      transition-colors">
              Accueil
            </a>
            <a routerLink="/catalogue"
               routerLinkActive="text-orange-500"
               class="text-gray-300 hover:text-orange-500
                      font-bold uppercase text-sm tracking-wide
                      transition-colors">
              Catalogue
            </a>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">

            <!-- Panier -->
            <a routerLink="/cart"
               class="relative p-2 text-gray-300
                      hover:text-orange-500 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              @if (cart.totalItems() > 0) {
                <span class="absolute -top-1 -right-1 bg-orange-500
                             text-white text-xs w-5 h-5 rounded-full
                             flex items-center justify-center
                             font-bold">
                  {{ cart.totalItems() }}
                </span>
              }
            </a>

            <!-- Admin connecté -->
            @if (auth.isLoggedIn() && auth.isAdmin()) {
              <div class="hidden md:flex items-center gap-2">
                <a routerLink="/admin"
                   class="btn-primary text-xs py-2 px-4">
                  ⚙️ Admin
                </a>
                <button (click)="logout()"
                        class="text-gray-400 hover:text-red-400
                               transition-colors p-2">
                  <svg class="w-5 h-5" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7"/>
                  </svg>
                </button>
              </div>
            }

            <!-- Mobile menu -->
            <button (click)="toggleMenu()"
                    class="md:hidden p-2 text-gray-300
                           hover:text-orange-500 transition-colors">
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
          <div class="md:hidden py-4 border-t border-gray-700 space-y-1">
            <a routerLink="/" (click)="menuOpen = false"
               class="block px-4 py-2.5 text-gray-300
                      hover:text-orange-500 hover:bg-[#162040]
                      rounded-lg font-bold uppercase text-sm
                      tracking-wide transition-colors">
              Accueil
            </a>
            <a routerLink="/catalogue" (click)="menuOpen = false"
               class="block px-4 py-2.5 text-gray-300
                      hover:text-orange-500 hover:bg-[#162040]
                      rounded-lg font-bold uppercase text-sm
                      tracking-wide transition-colors">
              Catalogue
            </a>
            @if (auth.isAdmin()) {
              <a routerLink="/admin" (click)="menuOpen = false"
                 class="block px-4 py-2.5 text-orange-500
                        hover:bg-[#162040] rounded-lg font-bold
                        uppercase text-sm tracking-wide">
                ⚙️ Admin
              </a>
            }
          </div>
        }
      </div>

      <!-- Barre Admin discrète -->
      @if (!auth.isLoggedIn()) {
        <div class="bg-[#06101e] border-t border-gray-800">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-end py-1">
              <button (click)="loginAdmin()"
                      class="flex items-center gap-1 text-xs
                             text-gray-600 hover:text-gray-400
                             transition-colors py-1 px-2">
                <svg class="w-3 h-3" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2
                           0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002
                           2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Espace Admin
              </button>
            </div>
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  menuOpen = false;

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  loginAdmin(): void { this.auth.login(); }
  logout(): void { this.auth.logout(); }
}