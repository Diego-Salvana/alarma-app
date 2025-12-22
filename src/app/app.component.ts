import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private router = inject(Router);

  ngOnInit () {
    App.addListener('backButton', () => {
      if (this.router.url !== '/home') {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  }
}
