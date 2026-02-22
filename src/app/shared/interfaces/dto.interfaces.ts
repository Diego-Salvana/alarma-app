import { Casa } from '.';
import { CentralD, DeviceD } from './domain.interfaces';

export interface TriggerDTO {
  sonando: CentralD['sonando'],
  numeroSensor?: DeviceD['numeroSensor']
}

export interface SensorArmConfigDTO {
  numeroSensor: DeviceD['numeroSensor'];
  estado: DeviceD['estado'];
};

export interface UpdateHouseDTO {
  nombre?: Casa['nombre'];
  direccion?: Partial<Casa['direccion']>;
}
