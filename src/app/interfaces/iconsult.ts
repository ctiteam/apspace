export interface ConsultationHour {
  id: number;
  additional_note: string;
  booking_datetime: string;
  consultation_with: string;
  reason: string;
  remark: string;
  status: string;
  student_sam_account_name: string;
  slot_id: number;
  slot_start_time: string;
  slot_end_time: string;
  slot_lecturer_sam_account_name: string;
  slot_room_code: string;
  slot_venue: string;
  synced_to_gims: string;
}

export interface ConsultationSlot {
  end_time: string;
  id: number;
  room_code: string;
  booking_detail?: ConsultationHour;
  slot_id: number;
  start_time: string;
  status: string;
  venue: string;
}

// export interface LecturerSlotDetails {
//   con_with: string;
//   contime: string;
//   endtime: string;
//   feedbackid: string | null;
//   location: string;
//   note: string;
//   reason: string;
//   slotid: number;
//   stuEmail: string;
//   stuPhone: string;
//   studentname: string;
//   tpnumber: string;
//   venue: string;
// }

export interface UnavailabilityDetails {
  end_date: string;
  repeat: string;
  start_date: string;
  start_time: string;
  unavailability_id: number;
  unavailibilityid: number;
}

// export interface ConsultationSlot {
//   availibilityid: number;
//   date: string;
//   datee: string;
//   datetime: string;
//   datetimeforsorting: string;
//   endtime: string;
//   location: string;
//   status: string;
//   time: string;
//   time_between_insertiondays: number;
//   timee: string;
//   venue: string;
// }

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
  room_code: string;
  venue: string;
}

export interface SlotDuplicated {
  res: string;
}

export interface LecturerRemarks {
  slotid: number;
  feedback: number;
  res: string;
}
