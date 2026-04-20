import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Bouton flottant -->
    <div class="fixed bottom-6 right-6 z-50">

      <!-- Chat window -->
      @if (isOpen()) {
        <div class="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl
                    border border-gray-100 overflow-hidden
                    animate-in slide-in-from-bottom-4">

          <!-- Header -->
          <div class="bg-[#0a1628] px-4 py-3 flex items-center
                      justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex
                          items-center justify-center text-white
                          font-black text-sm">
                S
              </div>
              <div>
                <div class="text-white font-bold text-sm">
                  SaadBot
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-400 rounded-full
                               animate-pulse"></span>
                  <span class="text-green-400 text-xs">En ligne</span>
                </div>
              </div>
            </div>
            <button (click)="toggleChat()"
                    class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Messages -->
          <div #messagesContainer
               class="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50"
               id="chat-messages">

            <!-- Message de bienvenue -->
            <div class="flex gap-2">
              <div class="w-7 h-7 bg-[#0a1628] rounded-full flex
                          items-center justify-center shrink-0">
                <span class="text-orange-500 text-xs font-black">S</span>
              </div>
              <div class="bg-white rounded-2xl rounded-tl-none px-3 py-2
                          shadow-sm max-w-[80%]">
                <p class="text-sm text-gray-800">
                  👋 Bonjour ! Je suis SaadBot, comment puis-je
                  vous aider aujourd'hui ?
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  Produits · Commandes · Livraison
                </p>
              </div>
            </div>

            @for (msg of messages(); track $index) {
              @if (msg.role === 'user') {
                <div class="flex justify-end">
                  <div class="bg-orange-500 text-white rounded-2xl
                              rounded-tr-none px-3 py-2 max-w-[80%]
                              shadow-sm">
                    <p class="text-sm">{{ msg.content }}</p>
                    <p class="text-xs text-orange-200 mt-1 text-right">
                      {{ msg.time }}
                    </p>
                  </div>
                </div>
              } @else {
                <div class="flex gap-2">
                  <div class="w-7 h-7 bg-[#0a1628] rounded-full flex
                              items-center justify-center shrink-0">
                    <span class="text-orange-500 text-xs font-black">
                      S
                    </span>
                  </div>
                  <div class="bg-white rounded-2xl rounded-tl-none
                              px-3 py-2 shadow-sm max-w-[80%]">
                    <p class="text-sm text-gray-800 whitespace-pre-wrap">
                      {{ msg.content }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ msg.time }}
                    </p>
                  </div>
                </div>
              }
            }

            <!-- Typing indicator -->
            @if (isTyping()) {
              <div class="flex gap-2">
                <div class="w-7 h-7 bg-[#0a1628] rounded-full flex
                            items-center justify-center shrink-0">
                  <span class="text-orange-500 text-xs font-black">S</span>
                </div>
                <div class="bg-white rounded-2xl rounded-tl-none
                            px-4 py-3 shadow-sm">
                  <div class="flex gap-1">
                    <span class="w-2 h-2 bg-gray-400 rounded-full
                                 animate-bounce"
                          style="animation-delay:0ms"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full
                                 animate-bounce"
                          style="animation-delay:150ms"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full
                                 animate-bounce"
                          style="animation-delay:300ms"></span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Suggestions rapides -->
          @if (messages().length === 0) {
            <div class="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <div class="flex flex-wrap gap-2">
                @for (suggestion of suggestions; track suggestion) {
                  <button (click)="sendSuggestion(suggestion)"
                          class="text-xs bg-white border border-gray-200
                                 text-gray-600 px-3 py-1.5 rounded-full
                                 hover:border-orange-500
                                 hover:text-orange-500 transition-all
                                 font-medium">
                    {{ suggestion }}
                  </button>
                }
              </div>
            </div>
          }

          <!-- Input -->
          <div class="p-3 border-t border-gray-100 bg-white">
            <div class="flex gap-2">
              <input [(ngModel)]="inputMessage"
                     (keyup.enter)="sendMessage()"
                     type="text"
                     placeholder="Votre message..."
                     [disabled]="isTyping()"
                     class="flex-1 border-2 border-gray-200 rounded-xl
                            px-3 py-2 text-sm focus:outline-none
                            focus:border-orange-500 transition-colors
                            disabled:opacity-50"/>
              <button (click)="sendMessage()"
                      [disabled]="!inputMessage.trim() || isTyping()"
                      class="w-10 h-10 bg-orange-500 text-white
                             rounded-xl flex items-center justify-center
                             hover:bg-orange-600 transition-colors
                             disabled:opacity-40
                             disabled:cursor-not-allowed shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Toggle button -->
      <button (click)="toggleChat()"
              class="w-14 h-14 bg-[#0a1628] text-white rounded-full
                     flex items-center justify-center shadow-xl
                     hover:bg-orange-500 transition-all duration-300
                     hover:scale-110 relative ml-auto">
        @if (isOpen()) {
          <svg class="w-6 h-6" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        } @else {
          <svg class="w-6 h-6" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418
                     -4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3
                     20l1.395-3.72C3.512 15.042 3 13.574 3 12c0
                     -4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <!-- Notification dot -->
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-orange-500
                       rounded-full flex items-center justify-center
                       text-xs font-bold animate-pulse">
            !
          </span>
        }
      </button>
    </div>
  `
})
export class ChatbotComponent {

  private readonly http = inject(HttpClient);

  // ============ STATE ============
  readonly isOpen = signal(false);
  readonly isTyping = signal(false);
  readonly messages = signal<Message[]>([]);

  inputMessage = '';

  readonly suggestions = [
    '🚚 Délais de livraison ?',
    '📦 Suivre ma commande',
    '👟 Tailles disponibles ?',
    '💰 Frais de livraison ?'
  ];

  // ============ METHODS ============
  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  sendSuggestion(suggestion: string): void {
    this.inputMessage = suggestion;
    this.sendMessage();
  }

  sendMessage(): void {
    const msg = this.inputMessage.trim();
    if (!msg || this.isTyping()) return;

    const time = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    });

    // Ajoute message user
    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', content: msg, time }
    ]);

    this.inputMessage = '';
    this.isTyping.set(true);

    // Scroll bas
    setTimeout(() => this.scrollToBottom(), 100);

    // Appel API
    this.http.post<{ message: string }>('/api/chat', {
      message: msg,
      history: this.messages().slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }))
    }).subscribe({
      next: (res) => {
        const responseTime = new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit', minute: '2-digit'
        });
        this.messages.update(msgs => [
          ...msgs,
          {
            role: 'assistant',
            content: res.message,
            time: responseTime
          }
        ]);
        this.isTyping.set(false);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => {
        this.messages.update(msgs => [
          ...msgs,
          {
            role: 'assistant',
            content: 'Désolé, une erreur est survenue. ' +
                     'Réessayez dans un moment.',
            time: new Date().toLocaleTimeString('fr-FR', {
              hour: '2-digit', minute: '2-digit'
            })
          }
        ]);
        this.isTyping.set(false);
      }
    });
  }

  private scrollToBottom(): void {
    const el = document.getElementById('chat-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }
}