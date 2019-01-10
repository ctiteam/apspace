export interface FreeSlotsLec {
  availibilityid: number;
  date: string;
  datee: string;
  datetime: string;
  endTime: string;
  location: string;
  slotid: number;
  status: string;
  time: string;
  timee: string;
  userid: number;
  venue: string;
}

export interface ConDetail {
  availibilityid: number;
  date: string;
  datee: string;
  datetime: string;
  endTime: string;
  location: string;
  slotid: number;
  status: string;
  time: string;
  timee: string;
  userid: number;
  venue: string;
}
export interface UnavailruleDet {
  unavailibilityid: number;
  unavailability_id: number;
  repeat: string;
  start_time: string;
  start_date: string;
  end_date: string;
}

export interface Starttimes {
  start_time: string;
}

export interface Feedback {
  slotid: number;
  feedback: number;
  res: string;
}

export interface Upcomingcon {
  datetime: string;
  date: string;
  starttime: string;
  poststarttime: string;
  datetimeforsorting: string;
  endtime: string;
  location: string;
  venue: string;
  lecname: string;
  availibilityid: number;
  slotid: number;
  casid: number;
  status: string;
}

export interface DetailpageStudent {
  contime: string;
  endTime: string;
  location: string;
  venue: string;
  lecname: string;
  con_with: string;
  reason: string;
  phone: string;
  note: string;
  datetime: number;
  status: number;
  LecEmail: number;
  cancelreason: string;
}

export interface FreeSlots {
  location: string;
  venue: string;
  datetime: string;
  time: string;
  timee: string;
  endtime: string;
  datee: string;
  availibilityid: string;
  date: string;
  status: number;
}

export interface StaffName {
  name: string;
}

export interface DepName {
  res: string;
}

export interface LecGetRulesDet {
  start_time: string;
  date: string;
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
}

export interface GetRooms {
  rooms: string;
}
