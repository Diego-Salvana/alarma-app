import { Component, inject, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private location = inject(Location);
  private appUrlListener?: PluginListenerHandle;
  private backListener?: PluginListenerHandle;

  constructor () {
    this.backButtonListener();
    this.urlOpenListener();
  }

  private async urlOpenListener () {
    this.appUrlListener = await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const slug = new URL(event.url).pathname;
      
      this.zone.run(() => this.router.navigateByUrl(slug));
    });
  }

  private async backButtonListener () {
    this.backListener = await App.addListener('backButton', () => {
      this.zone.run(() => this.router.url !== '/home' ? this.location.back() : App.exitApp());
    });
  }
}
