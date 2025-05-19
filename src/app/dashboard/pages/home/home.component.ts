import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HouseCardComponent } from '../../components';
import { HouseService } from '../../services';
import { HouseResponse } from '../../../auth/interfaces';

@Component({
  selector: 'app-home',
  imports: [HouseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private houseService = inject(HouseService);
  sites = signal<HouseResponse[]>([]);

  ngOnInit () {
    this.houseService.getAll().subscribe({
      next: houses => this.sites.set(houses)
    });
  }
}
