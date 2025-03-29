import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveRouteService {
  private router = inject(Router);
  private _isHome = signal<boolean>(true);
  isHome = computed(() => this._isHome());

  constructor () {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(ev => ev.urlAfterRedirects.includes('home') ? this._isHome.set(true) : this._isHome.set(false));
  }
}
