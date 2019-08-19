export interface BusTrips {
  trips: BusTrip[];
}

export interface BusTrip {
  id: number;
  bus_assigned: string;
  trip_from: string;
  trip_to: string;
  trip_day: string;
  trip_time: string;
  applicable_from: string;
  applicable_to: string;
  trip_from_display_name: string;
  trip_to_display_name: string;
  trips_override: number;
}

export interface APULocations {
  locations: APULocation[];
}

export interface APULocation {
  location_name: string;
  location_nice_name: string;
  location_color: string;
  location_type: string;
  location_latitude: string;
  location_longitude: string;
  location_pickup_latitude: string;
  location_pickup_longitude: string;
  location_full_address: {
    location_address: string;
    location_contact_number: string;
  };
  location_image_path: string;
}
