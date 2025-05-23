export type ProfileProp = 'name' | 'lastname' | 'phone' | 'password';

export type HouseProp = 'houseName' | 'street' | 'number' | 'city' | 'sensorName';

export interface ModalDataTransfer {
  name?: string;
  lastname?: string;
  phone?: string;
  houseName?: string;
  street?: string;
  number?: string;
  city?: string;
  sensorName?: string;
  newPassword?: string | null;
}
