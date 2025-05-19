import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HouseCardComponent } from '../../components';
import { House } from '../../interfaces';

@Component({
  selector: 'app-home',
  imports: [HouseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  sites: House[] = [
    { id: 1, nombre: 'Casa Principal', direccion: 'Mendoza 2040', central: 'desactivada' },
    { id: 2, nombre: 'Quinta los Arces', direccion: 'Ruta 120', central: 'activada' },
    { id: 3, nombre: 'Casa Principal', direccion: 'Mendoza 2040', central: 'desactivada' },
    { id: 4, nombre: 'Casa Principal', direccion: 'Mendoza 2040', central: 'desactivada' },
    { id: 5, nombre: 'Casa Principal', direccion: 'Mendoza 2040', central: 'desactivada' },
    { id: 6, nombre: 'Casa Principal', direccion: 'Mendoza 2040', central: 'desactivada' },
    { id: 7, nombre: 'Casa Principal', direccion: 'Mendoza 2040', central: 'desactivada' },
    { id: 8, nombre: 'Casa Principal', direccion: 'Mendoza 2040', central: 'desactivada' }
  ];
}
