import { Component, OnInit, inject, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';
import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { LoadingService } from './core/services/loading.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ChatbotComponent,LoadingScreenComponent], 
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
      <app-chatbot />
      <app-loading-screen />
    </div>
  `
})
export class AppComponent {

   loadingService = inject(LoadingService);

  texts = [
    'Chargement du store...',
    'Chargement des produits...',
    'Préparation de votre expérience...'
  ];

  textIndex = signal(0);
  loadingText = signal(this.texts[0]);

  ngOnInit(): void {
    this.loadingService.show();

    const interval = setInterval(() => {
      const next = (this.textIndex() + 1) % this.texts.length;
      this.textIndex.set(next);
      this.loadingText.set(this.texts[next]);
    }, 900);

    const hideLoader = () => {
      clearInterval(interval);
      setTimeout(() => this.loadingService.hide(), 500);
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 700);
    } else {
      window.addEventListener('load', hideLoader, { once: true });
      setTimeout(hideLoader, 4000);
    }
  }
}