export interface BusTrips {
  trips: Trips[];
}

export interface Trips {
  id: number;
  bus_assigned: string;
  trip_from: string;
  trip_to: string;
  trip_day: string;
  trip_time: string;
  applicable_from: string;
}
