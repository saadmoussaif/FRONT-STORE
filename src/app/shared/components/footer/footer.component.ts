import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-900 text-white mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">S</span>
              </div>
              <span class="text-xl font-bold">SaadStore</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Votre boutique de vêtements tendance au Maroc.
            </p>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Navigation</h3>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a routerLink="/" class="hover:text-pink-400 transition-colors">Accueil</a></li>
              <li><a routerLink="/catalogue" class="hover:text-pink-400 transition-colors">Catalogue</a></li>
              <li><a routerLink="/cart" class="hover:text-pink-400 transition-colors">Panier</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Maroc</li>
              <li>contact&#64;saadstore.ma</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; 2026 SaadStore. Tous droits réservés.
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}