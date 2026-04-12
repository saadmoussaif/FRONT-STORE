

import { Injectable, signal, computed } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private keycloak: Keycloak | null = null;

  // ============ STATE ============
  private readonly _isLoggedIn = signal(false);
  private readonly _userProfile = signal<any>(null);
  private readonly _roles = signal<string[]>([]);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly userProfile = this._userProfile.asReadonly();
  readonly roles = this._roles.asReadonly();

  readonly isAdmin = computed(() =>
    this._roles().includes('ADMIN')
  );

  readonly isClient = computed(() =>
    this._roles().includes('CLIENT')
  );

  readonly userName = computed(() => {
    const profile = this._userProfile();
    if (!profile) return 'Utilisateur';
    return profile.firstName
      ?? profile.username
      ?? 'Utilisateur';
  });

  readonly userEmail = computed(() =>
    this._userProfile()?.email ?? ''
  );

  // ============ INIT ============
  async init(): Promise<void> {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8180',
      realm: 'saadstore',
      clientId: 'saadstore-angular'
    });

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false
      });

      this._isLoggedIn.set(authenticated);

      if (authenticated) {
        await this.loadUserProfile();
        this.scheduleTokenRefresh();
      }
    } catch (error) {
      console.error('Keycloak init error:', error);
    }
  }

  // ============ AUTH ACTIONS ============
  async login(): Promise<void> {
    await this.keycloak?.login({
      redirectUri: window.location.origin + '/'
    });
  }

  async register(): Promise<void> {
    await this.keycloak?.register({
      redirectUri: window.location.origin + '/'
    });
  }

  async logout(): Promise<void> {
    this._isLoggedIn.set(false);
    this._userProfile.set(null);
    this._roles.set([]);
    await this.keycloak?.logout({
      redirectUri: window.location.origin
    });
  }

  async forgotPassword(): Promise<void> {
    await this.keycloak?.login({
      action: 'UPDATE_PASSWORD',
      redirectUri: window.location.origin + '/'
    });
  }

  // ============ TOKEN ============
  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloak?.updateToken(30);
      return refreshed ?? false;
    } catch {
      await this.login();
      return false;
    }
  }

  private scheduleTokenRefresh(): void {
    setInterval(async () => {
      try {
        await this.keycloak?.updateToken(60);
      } catch {
        console.error('Token refresh failed');
      }
    }, 60000);
  }

  // ============ PROFILE ============
  private async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloak?.loadUserProfile();
      this._userProfile.set(profile);

      const tokenParsed = this.keycloak?.tokenParsed as any;
      const realmRoles: string[] =
        tokenParsed?.realm_access?.roles ?? [];
      this._roles.set(realmRoles);
    } catch (error) {
      console.error('Profile load error:', error);
    }
  }
}