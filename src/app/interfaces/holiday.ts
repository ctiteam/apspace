export interface Holidays {
  holidays: Holiday[];
}

export interface Holiday {
  holiday_id: number;
  holiday_name: string;
  holiday_description: string | undefined;
  holiday_start_date: string;
  holiday_end_date: string;
  holiday_people_affected: string;
}
