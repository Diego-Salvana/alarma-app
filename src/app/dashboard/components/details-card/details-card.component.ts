import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { BtnEditCardComponent, ProfileModalComponent, HouseModalComponent } from '..';
import { CardType, ProfileModalField, ProfileUpdate, HouseUpdate, HouseModalField } from '../../../shared/interfaces';
import { Button } from 'primeng/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-details-card',
  imports: [Card, BtnEditCardComponent, Button, NgClass, ProfileModalComponent, HouseModalComponent],
  templateUrl: './details-card.component.html',
  styleUrl: './details-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsCardComponent {
  type = input.required<CardType>();
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  isSubmitted = input<boolean>(true);
  disabled = input<boolean>(false);
  editable = input<boolean>(false);
  accentuated = input<boolean>(false);
  initialPropValue = input<string>('');
  profileField = input<ProfileModalField>('name');
  houseField = input<HouseModalField>('sensorName');
  isModalOpen = signal(false);
  onSaveProfile = output<ProfileUpdate>();
  onSaveHouse = output<HouseUpdate>();

  showModal () {
    this.isModalOpen.set(true);
  }

  resetModalVisibility () {
    this.isModalOpen.set(false);
  }

  saveProfile (data: ProfileUpdate) {
    this.onSaveProfile.emit(data);
  }

  saveHouse (data: HouseUpdate) {
    this.onSaveHouse.emit(data);
  }
}
