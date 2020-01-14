export interface ExamSchedule {
  intake: string;
  module: string;
  subjectDescription: string;
  venue: string;
  since: string;
  until: string;
  docketsDue: string;
  appraisalsDue: string | null;
  resultDate: string | null;
}

export interface ExamResit {
  EXAM_DATE: string;
  EXAM_TIME: string;
  EXPECTED_RELEAS_DATE: string;
  INTAKE_CODE: string;
  LECTURER_CODE: string;
  LECTURER_NAME: string;
  SUBJECT_CODE: string;
  SUBJECT_DESCRIPTION: string;
  VENUE: string;
}
