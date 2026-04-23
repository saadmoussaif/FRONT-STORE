import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="loading-overlay">
      <div class="loading-card">

        <div class="brand">
          <div class="brand-icon">S</div>
          <div class="brand-text">
            <h1><span class="white">SAAD</span><span class="orange">STORE</span></h1>
            <p>SPORT & GEAR</p>
          </div>
        </div>

        <div class="spinner-wrap">
          <div class="spinner outer"></div>
          <div class="spinner middle"></div>
          <div class="spinner inner"></div>
          <div class="center-badge">S</div>
        </div>

        <div class="progress">
          <div class="progress-bar"></div>
        </div>

        <p class="loading-text">{{ loadingText }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        linear-gradient(180deg, #ff7a0a 0 36px, #04152d 36px 100%);
    }

    .loading-card {
      width: min(92vw, 460px);
      padding: 32px 28px;
      border-radius: 24px;
      background: rgba(4, 21, 45, 0.96);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow:
        0 20px 60px rgba(0,0,0,0.45),
        0 0 0 1px rgba(255,255,255,0.03) inset;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 28px;
    }

    .brand-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: #ff7a0a;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      font-weight: 800;
      box-shadow: 0 8px 22px rgba(255, 122, 10, 0.35);
    }

    .brand-text h1 {
      margin: 0;
      line-height: 1;
      font-size: 1.8rem;
      font-weight: 900;
      letter-spacing: 0.5px;
    }

    .brand-text p {
      margin: 4px 0 0;
      color: rgba(255,255,255,0.7);
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .white {
      color: #ffffff;
    }

    .orange {
      color: #ff7a0a;
      margin-left: 4px;
    }

    .spinner-wrap {
      position: relative;
      width: 130px;
      height: 130px;
      margin: 12px 0 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      position: absolute;
      border-radius: 50%;
      border-style: solid;
    }

    .outer {
      inset: 0;
      border-width: 3px;
      border-color: rgba(255,255,255,0.08);
      animation: spin 2.4s linear infinite;
    }

    .middle {
      inset: 12px;
      border-width: 3px;
      border-color: #ff7a0a transparent transparent transparent;
      animation: spin 1.2s linear infinite;
    }

    .inner {
      inset: 24px;
      border-width: 3px;
      border-color: transparent transparent #ffffff transparent;
      animation: spinReverse 0.9s linear infinite;
    }

    .center-badge {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #ff7a0a, #ff9c42);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.1rem;
      box-shadow: 0 8px 20px rgba(255,122,10,0.35);
      animation: pulse 1.4s ease-in-out infinite;
    }

    .progress {
      width: 220px;
      height: 6px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255,255,255,0.08);
      margin-bottom: 14px;
    }

    .progress-bar {
      height: 100%;
      width: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #ff7a0a, #ffffff, #ff7a0a);
      transform-origin: left;
      animation: loadingBar 1.6s ease-in-out infinite;
    }

    .loading-text {
      margin: 0;
      color: rgba(255,255,255,0.78);
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.4px;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes spinReverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }

    @keyframes loadingBar {
      0% {
        transform: scaleX(0.15);
        opacity: 0.5;
      }
      50% {
        transform: scaleX(1);
        opacity: 1;
      }
      100% {
        transform: scaleX(0.15);
        opacity: 0.5;
      }
    }
  `]
})
export class LoadingScreenComponent {
  @Input() show = false;
  @Input() loadingText = 'Chargement du catalogue...';
}