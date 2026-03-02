import { Address, AddressResponse, CentralEvent, CentralEventResponse, DeviceResponse, House, HouseResponse, LoginResponse, ProfileResponse, Sensor, User } from '../interfaces';

export function mapLoginResponseToUser (response: LoginResponse): User {
  return {
    id: response._id,
    firstName: response.nombre,
    lastName: response.apellido,
    username: response.nombreUsuario,
    email: response.email,
    phone: response.telefono,
    isEnabled: response.habilitado,
    houses: response.casas.map(mapHouseResponseToDomain)
  };
}

export function mapDeviceResponseToSensor (device: DeviceResponse): Sensor {
  return {
    id: device.dispositivoId,
    number: device.numeroSensor,
    name: device.nombre,
    type: device.tipo,
    state: device.estado,
    history: device.historial
  };
}

export function mapCentralEventResponseToDomain (event: CentralEventResponse[]): CentralEvent[] {
  return event.map(({ fechaHora, nombreDispositivo }) => ({
    timestamp: fechaHora,
    deviceName: nombreDispositivo
  }));
}

export function mapAddressResponseToDomain (address: AddressResponse): Address {
  return {
    street: address.calle,
    number: address.numero,
    city: address.ciudad
  };
}

export function mapHouseResponseToDomain (house: HouseResponse): House {
  return {
    id: house._id,
    displayName: house.nombre,
    houseName: house.nombreCasa,
    address: mapAddressResponseToDomain(house.direccion),
    alarmState: house.alarmaEncendida,
    isRinging: house.sonando ?? false,
    sensors: house.sensores?.map(mapDeviceResponseToSensor) ?? []
  };
}

export function mapProfileResponseToDomain (profile: ProfileResponse): User {
  return {
    id: profile._id,
    firstName: profile.nombre,
    lastName: profile.apellido,
    username: profile.nombreUsuario,
    email: profile.email,
    phone: profile.telefono,
    isEnabled: profile.habilitado,
    houses: profile.casas.map(mapHouseResponseToDomain)
  };
}
