import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Section } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ActiveRouteService {
  private router = inject(Router);
  private _activeSection = signal<Section>('home');
  activeSection = computed(() => this._activeSection());

  constructor () {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(ev => {
      const url = ev.urlAfterRedirects;
      const path = url.split('/').pop() as Section;

      switch (path) {
        case 'home':
          this._activeSection.set('home');
          break;
        case 'hub':
          this._activeSection.set('hub');
          break;
        case 'history':
          this._activeSection.set('history');
          break;
        case 'profile':
          this._activeSection.set('profile');
          break;
        default:
          if (url.includes('sensor')) this._activeSection.set('sensor');
          else if (url.includes('house')) this._activeSection.set('house');
      }
    });
  }
}
