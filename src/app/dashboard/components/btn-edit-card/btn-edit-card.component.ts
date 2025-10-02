import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-btn-edit-card',
  imports: [ButtonModule],
  templateUrl: './btn-edit-card.component.html',
  styleUrl: './btn-edit-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BtnEditCardComponent {
  disabled = input<boolean>(false);
}
