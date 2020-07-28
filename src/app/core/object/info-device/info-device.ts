export interface InfoDevice {
    error: boolean;
    message: string;
    info: Info;
}

export interface Info {
    CPU: string;
    Detail: string;
    Image: string;
    Manufacturer: string;
    Memory: string;
    Release: string;
    type: string;
    0?: string;
    1?: string;
}
