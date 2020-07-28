export interface GetDevices {
    devices: Devices[];
    error: boolean;
    message: string;
}

export interface Devices {
    MAC: string;
    id: string;
    name: string;
    devices: TypeDevices[];
    image: string;
    type: string;
    alive: boolean;
}

export interface TypeDevices {
    id: string;
    nameDevice: string;
    type: string;
    history: [];
    humidity: string;
    temperatureC: string
    temperatureF: string
    status: string;
}

export interface LogDevices {
    error: boolean;
    log: any[];
}

