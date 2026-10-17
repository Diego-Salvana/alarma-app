import { Address, AddressResponse, Camera, CameraResponse, CentralEvent, CentralEventResponse, DeviceResponse, House, HouseResponse, LoginResponse, ProfileResponse, Sensor, User } from '../interfaces';

export function mapLoginResponseToUser (response: LoginResponse): User {
  return {
    id: response._id,
    firstName: response.firstName,
    lastName: response.lastName,
    username: response.username,
    email: response.email,
    phone: response.phone,
    isEnabled: response.enabled,
    houses: response.houses.map(mapHouseResponseToDomain)
  };
}

export function mapDeviceResponseToSensor (device: DeviceResponse): Sensor {
  return {
    id: `${device.model}-${device.number}`,
    number: device.number,
    name: device.name,
    type: device.type,
    state: device.state,
    history: []
  };
}

export function mapCentralEventResponseToDomain (event: CentralEventResponse[]): CentralEvent[] {
  return event.map(({ date, type, deviceName, sensorNumber, userId }) => ({
    date,
    type: type as CentralEvent['type'],
    deviceName,
    sensorNumber,
    userId
  }));
}

export function mapAddressResponseToDomain (address: AddressResponse): Address {
  return {
    street: address.street,
    number: address.number,
    city: address.city,
    country: address.country
  };
}

export function mapCameraResponseToDomain (camera: CameraResponse): Camera {
  return {
    model: camera.model,
    number: camera.number,
    name: camera.name
  };
}

export function mapHouseResponseToDomain (house: HouseResponse): House {
  return {
    id: house._id,
    displayName: house.name,
    houseName: house.houseName,
    address: mapAddressResponseToDomain(house.address),
    alarmState: house.alarmState,
    isRinging: house.ringing ?? false,
    sensors: house.sensors?.map(mapDeviceResponseToSensor) ?? [],
    cameras: house.cameras?.map(mapCameraResponseToDomain) ?? []
  };
}

export function mapProfileResponseToDomain (profile: ProfileResponse): User {
  return {
    id: profile._id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username,
    email: profile.email,
    phone: profile.phone,
    isEnabled: profile.enabled,
    houses: profile.houses.map(mapHouseResponseToDomain)
  };
}
