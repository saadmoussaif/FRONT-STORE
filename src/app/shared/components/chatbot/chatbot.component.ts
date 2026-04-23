import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
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
<div class="fixed bottom-6 right-6 z-50">

  <!-- CHAT WINDOW -->
  @if (isOpen()) {
    <div class="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

      <!-- HEADER -->
      <div class="bg-[#0a1628] px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-sm">
            S
          </div>
          <div>
            <div class="text-white font-bold text-sm">SaadBot</div>
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span class="text-green-400 text-xs">En ligne</span>
            </div>
          </div>
        </div>
        <button (click)="toggleChat()" class="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <!-- MESSAGES -->
      <div #messagesContainer id="chat-messages"
           class="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">

        <!-- WELCOME -->
        <div class="flex gap-2">
          <div class="w-7 h-7 bg-[#0a1628] rounded-full flex items-center justify-center">
            <span class="text-orange-500 text-xs font-black">S</span>
          </div>
          <div class="bg-white rounded-2xl px-3 py-2 shadow-sm">
            👋 Bonjour ! Comment puis-je vous aider ?
          </div>
        </div>

        <!-- LOOP -->
        @for (msg of messages(); track $index) {
          @if (msg.role === 'user') {
            <div class="flex justify-end">
              <div class="bg-orange-500 text-white rounded-2xl px-3 py-2 max-w-[80%]">
                {{ msg.content }}
              </div>
            </div>
          } @else {
            <div class="flex gap-2">
              <div class="w-7 h-7 bg-[#0a1628] rounded-full flex items-center justify-center">
                <span class="text-orange-500 text-xs font-black">S</span>
              </div>
              <div class="bg-white rounded-2xl px-3 py-2 shadow-sm max-w-[80%] whitespace-pre-wrap">
                {{ msg.content }}
              </div>
            </div>
          }
        }

        <!-- TYPING -->
        @if (isTyping()) {
          <div class="text-sm text-gray-400">SaadBot est en train d’écrire...</div>
        }
      </div>

      <!-- INPUT -->
      <div class="p-3 border-t">
        <div class="flex gap-2">
          <input [(ngModel)]="inputMessage"
                 (keyup.enter)="sendMessage()"
                 class="flex-1 border rounded px-3 py-2"
                 placeholder="Votre message..." />
          <button (click)="sendMessage()"
                  class="bg-orange-500 text-white px-4 rounded">
            Envoyer
          </button>
        </div>
      </div>

    </div>
  }

  <!-- BUTTON -->
  <button (click)="toggleChat()"
          class="w-14 h-14 bg-[#0a1628] text-white rounded-full">
    💬
  </button>

</div>
  `
})
export class ChatbotComponent {

  private readonly http = inject(HttpClient);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  readonly isOpen = signal(false);
  readonly isTyping = signal(false);
  readonly messages = signal<Message[]>([]);

  inputMessage = '';

  // =========================
  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  // =========================
  sendMessage(): void {
    const msg = this.inputMessage.trim();
    if (!msg || this.isTyping()) return;

    const time = this.getTime();

    // USER MESSAGE
    this.messages.update(m => [...m, { role: 'user', content: msg, time }]);

    this.inputMessage = '';
    this.isTyping.set(true);
    this.scrollToBottom();

    // BACKEND CALL
    this.http.post<{ message: string }>('http://localhost:8080/api/chat', {
      message: msg,
      history: this.messages().slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }))
    }).subscribe({
      next: (res) => {
        this.messages.update(m => [
          ...m,
          {
            role: 'assistant',
            content: res.message,
            time: this.getTime()
          }
        ]);
        this.isTyping.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.messages.update(m => [
          ...m,
          {
            role: 'assistant',
            content: '❌ Erreur serveur',
            time: this.getTime()
          }
        ]);
        this.isTyping.set(false);
      }
    });
  }

  // =========================
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }

  // =========================
  private getTime(): string {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}