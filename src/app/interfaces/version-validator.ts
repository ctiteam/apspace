export interface VersionValidator {
    ios: PlatformData;
    android: PlatformData;
    maintenanceMode: boolean;
}

export interface PlatformData {
    latest: string;
    minimum: string;
    url: string;
}
