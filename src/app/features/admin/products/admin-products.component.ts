import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product ,Category} from '../../../core/models/product.model';


@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Produits</h1>
          <p class="text-gray-500 mt-1">
            {{ products().length }} produits au total
          </p>
        </div>
        <button (click)="openCreateModal()"
                class="btn-primary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau produit
        </button>
      </div>

      <!-- Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th class="text-left px-6 py-4 text-xs font-semibold
                           text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @if (loading()) {
                @for (i of skeletons; track i) {
                  <tr class="animate-pulse">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div class="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-10"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-14"></div>
                    </td>
                    <td class="px-6 py-4"></td>
                  </tr>
                }
              } @else {
                @for (product of products(); track product.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-100 rounded-lg flex
                                    items-center justify-center overflow-hidden
                                    shrink-0">
                          @if (product.imageUrl) {
                            <img [src]="product.imageUrl"
                                 [alt]="product.name"
                                 class="w-full h-full object-cover"/>
                          } @else {
                            <span class="text-lg">👕</span>
                          }
                        </div>
                        <div>
                          <div class="font-medium text-gray-900 text-sm">
                            {{ product.name }}
                          </div>
                          <div class="text-xs text-gray-400">
                            {{ product.color }} · {{ product.size }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="badge bg-gray-100 text-gray-600">
                        {{ product.category }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="font-semibold text-pink-600 text-sm">
                        {{ product.price | number:'1.0-0' }} MAD
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm font-medium"
                            [class.text-red-500]="product.stock === 0"
                            [class.text-orange-500]="
                              product.stock > 0 && product.stock <= 5"
                            [class.text-gray-700]="product.stock > 5">
                        {{ product.stock }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="badge"
                            [class]="product.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'">
                        {{ product.active ? 'Actif' : 'Inactif' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3 justify-end">
                        <button (click)="openEditModal(product)"
                                class="text-xs text-blue-600
                                       hover:text-blue-800 font-medium
                                       transition-colors">
                          Modifier
                        </button>
                        <button (click)="confirmDelete(product)"
                                class="text-xs text-red-500
                                       hover:text-red-700 font-medium
                                       transition-colors">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
        @if (!loading() && products().length === 0) {
          <div class="text-center py-12 text-gray-400">
            <div class="text-4xl mb-3">📦</div>
            <p>Aucun produit. Créez votre premier produit !</p>
          </div>
        }
      </div>
    </div>

    <!-- Modal Création / Édition -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/50 flex items-center
                  justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg
                    max-h-[90vh] overflow-y-auto shadow-xl">

          <!-- Header modal -->
          <div class="p-6 border-b border-gray-100 flex justify-between
                      items-center sticky top-0 bg-white">
            <h2 class="text-lg font-bold text-gray-900">
              {{ editMode() ? 'Modifier le produit' : 'Nouveau produit' }}
            </h2>
            <button (click)="closeModal()"
                    class="p-1 text-gray-400 hover:text-gray-600
                           transition-colors rounded-lg hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Body modal -->
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit *
              </label>
              <input [(ngModel)]="form.name"
                     type="text"
                     placeholder="Ex: T-shirt Premium"
                     class="input-field"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea [(ngModel)]="form.description"
                        rows="3"
                        placeholder="Description du produit"
                        class="input-field resize-none">
              </textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Prix (MAD) *
                </label>
                <input [(ngModel)]="form.price"
                       type="number"
                       min="0"
                       placeholder="299"
                       class="input-field"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input [(ngModel)]="form.stock"
                       type="number"
                       min="0"
                       placeholder="50"
                       class="input-field"/>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select [(ngModel)]="form.category" class="input-field">
                <option value="">Choisir une catégorie</option>
                @for (cat of categories; track cat.value) {
                  <option [value]="cat.value">{{ cat.label }}</option>
                }
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Taille
                </label>
                <select [(ngModel)]="form.size" class="input-field">
                  <option value="">Taille</option>
                  @for (size of sizes; track size) {
                    <option [value]="size">{{ size }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Couleur
                </label>
                <input [(ngModel)]="form.color"
                       type="text"
                       placeholder="Ex: Blanc"
                       class="input-field"/>
              </div>
            </div>

            @if (formError()) {
              <div class="bg-red-50 border border-red-200 text-red-600
                          text-sm p-3 rounded-lg">
                {{ formError() }}
              </div>
            }
          </div>

          <!-- Footer modal -->
          <div class="p-6 border-t border-gray-100 flex gap-3
                      justify-end sticky bottom-0 bg-white">
            <button (click)="closeModal()" class="btn-secondary">
              Annuler
            </button>
            <button (click)="saveProduct()"
                    [disabled]="saving()"
                    class="btn-primary disabled:opacity-50">
              @if (saving()) {
                <span class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"
                       fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Enregistrement...
                </span>
              } @else {
                {{ editMode() ? 'Modifier' : 'Créer' }}
              }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminProductsComponent implements OnInit {

  private readonly productService = inject(ProductService);

  // ============ STATE ============
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly showModal = signal(false);
  readonly editMode = signal(false);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly skeletons = [1, 2, 3, 4, 5];

  private selectedId: string | null = null;

  form: {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  size: string;
  color: string;
} = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  size: '',
  color: ''
};

  readonly categories = [
    { value: 'HOMME',       label: 'Homme' },
    { value: 'FEMME',       label: 'Femme' },
    { value: 'ENFANT',      label: 'Enfant' },
    { value: 'ACCESSOIRES', label: 'Accessoires' },
  ];

  readonly sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // ============ LIFECYCLE ============
  ngOnInit(): void {
    this.loadProducts();
  }

  // ============ METHODS ============
  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts(0, 100).subscribe({
      next: (page) => {
        this.products.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private resetForm(): void {
    this.form = {
      name: '', description: '', price: 0,
      stock: 0, category: '', size: '', color: ''
    };
    this.formError.set(null);
    this.selectedId = null;
  }

  openCreateModal(): void {
    this.editMode.set(false);
    this.resetForm();
    this.showModal.set(true);
  }

  openEditModal(product: Product): void {
    this.editMode.set(true);
    this.selectedId = product.id;
    this.form = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      size: product.size,
      color: product.color
    };
    this.formError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  saveProduct(): void {
  if (!this.isFormValid()) {
    this.formError.set('Veuillez remplir tous les champs obligatoires (*).');
    return;
  }
  this.saving.set(true);
  this.formError.set(null);

  const productData: Partial<Product> = {
    name: this.form.name,
    description: this.form.description,
    price: Number(this.form.price),
    stock: Number(this.form.stock),
    category: this.form.category as Product['category'],
    size: this.form.size,
    color: this.form.color
  };

  const obs$ = this.editMode() && this.selectedId
    ? this.productService.updateProduct(this.selectedId, productData)
    : this.productService.createProduct(productData);

  obs$.subscribe({
    next: () => {
      this.saving.set(false);
      this.closeModal();
      this.loadProducts();
    },
    error: () => {
      this.formError.set('Erreur lors de l\'enregistrement.');
      this.saving.set(false);
    }
  });
}

  confirmDelete(product: Product): void {
    if (confirm(`Supprimer "${product.name}" ?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => this.loadProducts()
      });
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.form.name.trim() &&
      this.form.description.trim() &&
      this.form.price > 0 &&
      this.form.stock >= 0 &&
      this.form.category
    );
  }
}