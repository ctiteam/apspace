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
  assessmentType?: string | null;
}
