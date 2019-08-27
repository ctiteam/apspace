export interface ConsultationHour {
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

export interface LecturerConsultation {
  availibilityid: number;
  date: string;
  dateandtime: string;
  datetime: string;
  endTime: string;
  location: string;
  status: string;
  time: string;
  timee: string;
  userid: number;
  venue: string;
  slotid: number[];
}

export interface LecturerSlotDetails {
  con_with: string;
  contime: string;
  endtime: string;
  feedbackid: string | null;
  location: string;
  note: string;
  reason: string;
  slotid: number;
  stuEmail: string;
  stuPhone: string;
  studentname: string;
  tpnumber: string;
  venue: string;
}

export interface ConsultationSlot {
  availibilityid: number;
  date: string;
  datee: string;
  datetime: string;
  datetimeforsorting: string;
  endtime: string;
  location: string;
  status: string;
  time: string;
  time_between_insertiondays: number;
  timee: string;
  venue: string;
}

export interface SlotDetails {
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

export interface Venue {
  id: number;
  rooms: string;
}

export interface SlotDuplicated {
  res: string;
}
