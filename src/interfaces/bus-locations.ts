export interface ApuLocations {
  locations: LocationsInterface[];
}

export interface LocationsInterface {
  location_name: string;
  location_nice_name: string;
  location_color: string;
  location_type: string;
  location_latitude: string;
  location_longitude: string;
  location_pickup_latitude: string;
  location_pickup_longitude: string;
  location_full_address: {
    location_address: string,
    location_contact_number: string | null
  };
  location_image_path: string | null;
}
