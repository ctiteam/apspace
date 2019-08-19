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
